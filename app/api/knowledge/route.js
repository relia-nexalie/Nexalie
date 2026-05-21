import { createClient } from '@/lib/supabase/server';

async function checkAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === 'relia.ebiya@gmail.com' ? user : null;
}

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('knowledge')
    .select('*')
    .order('priorite', { ascending: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data || []);
}

export async function POST(request) {
  const supabase = createClient();
  if (!await checkAdmin(supabase)) return Response.json({ error: 'Accès refusé' }, { status: 403 });
  const body = await request.json();
  const { categorie, contenu, mode, priorite, actif } = body;
  if (!categorie || !contenu) return Response.json({ error: 'Champs requis manquants' }, { status: 400 });
  const { data, error } = await supabase
    .from('knowledge')
    .insert({ categorie, contenu, mode: mode || 'both', priorite: priorite || 5, actif: actif !== false })
    .select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, data });
}

export async function PUT(request) {
  const supabase = createClient();
  if (!await checkAdmin(supabase)) return Response.json({ error: 'Accès refusé' }, { status: 403 });
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return Response.json({ error: 'ID requis' }, { status: 400 });
  updates.updated_at = new Date().toISOString();
  const { error } = await supabase.from('knowledge').update(updates).eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

export async function DELETE(request) {
  const supabase = createClient();
  if (!await checkAdmin(supabase)) return Response.json({ error: 'Accès refusé' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return Response.json({ error: 'ID requis' }, { status: 400 });
  const { error } = await supabase.from('knowledge').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
