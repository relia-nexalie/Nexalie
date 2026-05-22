import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

// Plans FR uniquement — AF utilise CinetPay
// Montants en centimes (EUR)
const PLANS_FR = {
  starter_monthly:      { amount: 5900,   interval: 'month', plan: 'starter',      label: 'Nexalie Starter — Mensuel' },
  starter_annual:       { amount: 59000,  interval: 'year',  plan: 'starter',      label: 'Nexalie Starter — Annuel (2 mois offerts)' },
  pro_monthly:          { amount: 12900,  interval: 'month', plan: 'pro',          label: 'Nexalie Pro — Mensuel' },
  pro_annual:           { amount: 129000, interval: 'year',  plan: 'pro',          label: 'Nexalie Pro — Annuel (2 mois offerts)' },
  institutions_monthly: { amount: 49000,  interval: 'month', plan: 'institutions', label: 'Nexalie Institutions — Mensuel' },
  institutions_annual:  { amount: 490000, interval: 'year',  plan: 'institutions', label: 'Nexalie Institutions — Annuel (2 mois offerts)' },
};

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Paiements non configurés' }, { status: 503 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const { planKey } = body;
  const plan = PLANS_FR[planKey];

  if (!plan) {
    return Response.json({ error: `Plan invalide : ${planKey}` }, { status: 400 });
  }

  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: plan.label },
          recurring: { interval: plan.interval },
          unit_amount: plan.amount,
        },
        quantity: 1,
      }],
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      metadata: { user_id: session.user.id, plan_key: planKey, plan: plan.plan, market: 'fr' },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      locale: 'fr',
    });

    return Response.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
