import { createClient } from '@/lib/supabase/server';

// Plans Afrique en FCFA (CinetPay attend des entiers en XOF/XAF)
const PLANS_AF = {
  starter_monthly:      { amount: 39000,   currency: 'XOF', plan: 'starter',      name: 'Nexalie Starter Mensuel' },
  starter_annual:       { amount: 390000,  currency: 'XOF', plan: 'starter',      name: 'Nexalie Starter Annuel' },
  pro_monthly:          { amount: 85000,   currency: 'XOF', plan: 'pro',          name: 'Nexalie Pro Mensuel' },
  pro_annual:           { amount: 850000,  currency: 'XOF', plan: 'pro',          name: 'Nexalie Pro Annuel' },
  institutions_monthly: { amount: 320000,  currency: 'XOF', plan: 'institutions', name: 'Nexalie Institutions Mensuel' },
  institutions_annual:  { amount: 3200000, currency: 'XOF', plan: 'institutions', name: 'Nexalie Institutions Annuel' },
};

export async function POST(request) {
  if (!process.env.CINETPAY_API_KEY || !process.env.CINETPAY_SITE_ID) {
    return Response.json({ error: 'Paiements Mobile Money non configurés' }, { status: 503 });
  }
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const { planKey } = await request.json();
  const plan = PLANS_AF[planKey];

  if (!plan) {
    return Response.json({ error: 'Plan invalide' }, { status: 400 });
  }

  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;
  const transactionId = `NX-${Date.now()}-${session.user.id.slice(0, 8)}`;

  const payload = {
    apikey: process.env.CINETPAY_API_KEY,
    site_id: process.env.CINETPAY_SITE_ID,
    transaction_id: transactionId,
    amount: plan.amount,
    currency: plan.currency,
    description: plan.name,
    customer_email: session.user.email,
    customer_name: session.user.user_metadata?.full_name || session.user.email,
    notify_url: `${origin}/api/cinetpay/webhook`,
    return_url: `${origin}/success?tx=${transactionId}`,
    cancel_url: `${origin}/pricing`,
    // Métadonnées passées dans la description étendue
    metadata: JSON.stringify({
      user_id: session.user.id,
      plan_key: planKey,
      plan: plan.plan,
    }),
    channels: 'ALL', // Tous les canaux : Orange Money, MTN MoMo, Wave, Moov...
    lang: 'fr',
  };

  try {
    const res = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.code !== '201') {
      return Response.json({ error: data.message || 'Erreur CinetPay' }, { status: 500 });
    }

    // Sauvegarder la transaction en attente dans Supabase
    await supabase.from('payment_intents').upsert({
      transaction_id: transactionId,
      user_id: session.user.id,
      provider: 'cinetpay',
      plan_key: planKey,
      plan: plan.plan,
      amount: plan.amount,
      currency: plan.currency,
      status: 'pending',
    }).catch(() => {}); // table optionnelle — ne bloque pas si absente

    return Response.json({ url: data.data.payment_url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
