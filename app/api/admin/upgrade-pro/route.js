import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// ──────────────────────────────────────────────────────────
// Admin — Simuler upgrade Pro sans Stripe
// POST /api/admin/upgrade-pro
// Réservé à relia.ebiya@gmail.com uniquement
// ──────────────────────────────────────────────────────────

const ADMIN_EMAIL = 'relia.ebiya@gmail.com';

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await service
    .from('profiles')
    .update({
      plan: 'pro',
      plan_active: true,
      plan_payment_issue: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('[admin/upgrade-pro]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, plan: 'pro' });
}
