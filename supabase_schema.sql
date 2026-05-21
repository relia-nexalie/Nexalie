-- ═══════════════════════════════════════════════════════
-- NEXALI — Schéma Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. TABLE PROFILES (étend auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  country text default 'fr',  -- 'fr' | 'ci' | 'cg' | 'cm' | 'sn' | 'other'
  plan text default 'free',    -- 'free' | 'starter' | 'business' | 'enterprise' | 'premium' | 'consulting'
  plan_active boolean default false,
  market text default 'fr',    -- 'fr' | 'af'
  stripe_customer_id text,
  stripe_subscription_id text,
  onboarding_completed boolean default false,
  audit_score integer,
  audit_level text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS : chaque utilisateur ne voit que son propre profil
alter table public.profiles enable row level security;

create policy "users_own_profile" on public.profiles
  for all using (auth.uid() = id);

-- 2. TABLE REPORTS (historique des rapports générés)
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  tool_name text not null,     -- 'Audit Digital' | 'Business Plan IA' | etc.
  result_json jsonb,
  score integer,
  level text,
  created_at timestamptz default now()
);

alter table public.reports enable row level security;

create policy "users_own_reports" on public.reports
  for all using (auth.uid() = user_id);

-- Index pour les requêtes fréquentes
create index if not exists reports_user_id_idx on public.reports(user_id);
create index if not exists reports_created_at_idx on public.reports(created_at desc);

-- 3. FONCTION : créer automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, country)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    coalesce(new.raw_user_meta_data->>'country', 'fr')
  );
  return new;
end;
$$;

-- Déclencher la création de profil à chaque inscription
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ═══════════════════════════════════════════════════════
-- MOBILE MONEY (Orange Money, Wave) — Note implémentation
-- ═══════════════════════════════════════════════════════
-- Pour les paiements Mobile Money en Afrique, intégrer :
--   • CinetPay (https://cinetpay.com) — Orange Money CI, Wave, MTN
--   • Stripe n'accepte pas encore XOF directement sur tous les pays
--   • Ajouter la table ci-dessous pour tracker les paiements manuels

create table if not exists public.mobile_money_payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null,           -- en FCFA
  currency text default 'XOF',
  operator text,                     -- 'orange_money' | 'wave' | 'mtn' | 'moov'
  phone_number text,
  transaction_ref text,
  status text default 'pending',     -- 'pending' | 'confirmed' | 'failed'
  plan_key text,
  confirmed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.mobile_money_payments enable row level security;

create policy "users_own_payments" on public.mobile_money_payments
  for all using (auth.uid() = user_id);
