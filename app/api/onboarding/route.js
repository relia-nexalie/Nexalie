import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  const body = await request.json();
  const { company_type, secteur, pays, objectif_principal, completed } = body;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Non authentifié' }, { status: 401 });

  const updates = {};
  if (company_type) updates.company_type = company_type;
  if (secteur) updates.secteur = secteur;
  if (pays) updates.pays = pays;
  if (objectif_principal) updates.objectif_principal = objectif_principal;
  if (completed) {
    updates.onboarding_completed = true;
    updates.onboarding_completed_at = new Date().toISOString();
  }

  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true });
}
