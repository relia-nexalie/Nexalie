import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Client Supabase avec clé service (bypass RLS) pour les webhooks
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = getServiceClient();

  const now = new Date().toISOString();

  // Paiement initial — abonnement activé
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId   = session.metadata?.user_id;
    const plan     = session.metadata?.plan;          // 'pro' | 'starter' | 'institutions'
    const planKey  = session.metadata?.plan_key;      // 'pro_monthly' etc. (conservé pour référence)

    if (userId && plan) {
      await supabase.from('profiles').update({
        plan,
        plan_key: planKey || null,
        plan_active: true,
        stripe_customer_id: session.customer || null,
        stripe_subscription_id: session.subscription || null,
        plan_started_at: now,
        updated_at: now,
      }).eq('id', userId);

      // Déclencher email de bienvenue Pro
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexalie.co';
      fetch(`${baseUrl}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'upgrade_prompt', userId }),
      }).catch(() => {});
    }
  }

  // Renouvellement mensuel/annuel — garder plan actif
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object;
    const subId = invoice.subscription;
    if (subId) {
      await supabase.from('profiles')
        .update({ plan_active: true, updated_at: now })
        .eq('stripe_subscription_id', subId);
    }
  }

  // Échec de paiement — marquer sans downgrade immédiat
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    const subId = invoice.subscription;
    if (subId) {
      await supabase.from('profiles')
        .update({ plan_payment_issue: true, updated_at: now })
        .eq('stripe_subscription_id', subId);
    }
  }

  // Mise à jour abonnement (changement de plan)
  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object;
    const { data: profile } = await supabase
      .from('profiles').select('id').eq('stripe_subscription_id', sub.id).single();
    if (profile) {
      await supabase.from('profiles').update({
        plan_active: sub.status === 'active',
        updated_at: now,
      }).eq('id', profile.id);
    }
  }

  // Résiliation — repasser en free
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const { data: profile } = await supabase
      .from('profiles').select('id').eq('stripe_subscription_id', sub.id).single();
    if (profile) {
      await supabase.from('profiles').update({
        plan: 'free',
        plan_active: false,
        plan_payment_issue: false,
        stripe_subscription_id: null,
        updated_at: now,
      }).eq('id', profile.id);
    }
  }

  return new Response('OK', { status: 200 });
}
