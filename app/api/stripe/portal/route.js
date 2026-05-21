import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 });
  }

  // Récupérer le stripe_customer_id depuis les profiles
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data: profile } = await service
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return Response.json({ error: 'Aucun abonnement Stripe trouvé' }, { status: 404 });
  }

  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/platform/account`,
    });
    return Response.json({ url: portalSession.url });
  } catch (err) {
    console.error('Stripe portal error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
