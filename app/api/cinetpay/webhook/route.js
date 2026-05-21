import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Mapping planKey → plan normalisé
const PLAN_MAP = {
  starter_monthly: 'starter',
  starter_annual: 'starter',
  pro_monthly: 'pro',
  pro_annual: 'pro',
  institutions_monthly: 'institutions',
  institutions_annual: 'institutions',
};

export async function POST(request) {
  const supabase = getServiceClient();

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { cpm_trans_id, cpm_site_id, cpm_result, cpm_error_message, cpm_amount, cpm_currency } = body;

  // Vérifier que la notification vient bien de CinetPay
  if (cpm_site_id !== process.env.CINETPAY_SITE_ID) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (cpm_result !== '00') {
    // Paiement échoué ou annulé — mettre à jour le statut si on track
    await supabase
      .from('payment_intents')
      .update({ status: 'failed', error: cpm_error_message })
      .eq('transaction_id', cpm_trans_id)
      .catch(() => {});
    return new Response('OK', { status: 200 });
  }

  // Paiement réussi — vérifier le statut de la transaction via l'API CinetPay
  const verifyRes = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: cpm_trans_id,
    }),
  });

  const verifyData = await verifyRes.json();

  if (verifyData.code !== '00' || verifyData.data?.cpm_result !== '00') {
    return new Response('Payment not confirmed', { status: 200 });
  }

  // Récupérer user_id et plan depuis notre table de transactions
  const { data: intent } = await supabase
    .from('payment_intents')
    .select('user_id, plan, plan_key')
    .eq('transaction_id', cpm_trans_id)
    .single();

  const userId = intent?.user_id;
  const plan = intent?.plan || PLAN_MAP[intent?.plan_key] || 'starter';

  if (!userId) {
    return new Response('User not found', { status: 200 });
  }

  // Mettre à jour le profil utilisateur
  await supabase.from('profiles').update({
    plan,
    subscription_status: 'active',
    updated_at: new Date().toISOString(),
  }).eq('id', userId);

  // Marquer la transaction comme complète
  await supabase.from('payment_intents').update({
    status: 'completed',
    confirmed_at: new Date().toISOString(),
  }).eq('transaction_id', cpm_trans_id).catch(() => {});

  // Déclencher email de confirmation (fire-and-forget)
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'payment_confirmed', userId, plan }),
  }).catch(() => {});

  return new Response('OK', { status: 200 });
}

// GET — CinetPay peut faire un GET pour vérifier que la route existe
export async function GET() {
  return new Response('CinetPay webhook OK', { status: 200 });
}
