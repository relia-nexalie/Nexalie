// POST /api/roadmap — sauvegarder une roadmap
// GET  /api/roadmap — récupérer les roadmaps de l'utilisateur
import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  const body = await request.json();
  const { roadmap_json, mode, context } = body;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Non authentifié' }, { status: 401 });

  const { data, error } = await supabase
    .from('roadmaps')
    .insert({ user_id: user.id, mode, roadmap_json, context })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, id: data.id });
}

export async function GET(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Non authentifié' }, { status: 401 });

  const { data } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return Response.json(data || []);
}
