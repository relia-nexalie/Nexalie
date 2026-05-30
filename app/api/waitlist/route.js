import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email, source = 'nexalie-watch' } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Email invalide.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('waitlist')
      .insert({ email: email.toLowerCase().trim(), source });

    if (error) {
      // Doublon — email déjà inscrit (unique constraint)
      if (error.code === '23505') {
        return Response.json({ ok: true, already: true });
      }
      throw error;
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[waitlist]', err);
    return Response.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
