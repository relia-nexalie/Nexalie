import { createClient } from '@/lib/supabase/server';

// GET — récupérer les rapports d'un utilisateur
export async function GET() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: 'Non authentifié' }, { status: 401 });

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ reports: data });
}

// POST — sauvegarder un rapport généré
export async function POST(request) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: 'Non authentifié' }, { status: 401 });

  const body = await request.json();
  const { tool_name, result_json, score, level } = body;

  const { data, error } = await supabase.from('reports').insert({
    user_id: session.user.id,
    tool_name,
    result_json,
    score: score || null,
    level: level || null,
    created_at: new Date().toISOString(),
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Déclencher email de notification (fire-and-forget)
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: request.headers.get('cookie') || '' },
    body: JSON.stringify({ type: 'report_generated', reportData: { toolName: tool_name, score, level } }),
  }).catch(() => {});

  return Response.json({ report: data });
}
