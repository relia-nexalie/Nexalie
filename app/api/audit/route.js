import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// ─── Helpers IA : analyse des réponses ─────────────────────────────────

function getWeakestAreas(reponses) {
  if (!reponses || typeof reponses !== 'object') return [];
  const entries = Object.entries(reponses);
  if (entries.length === 0) return [];

  return entries
    .map(([key, val]) => ({ key, score: typeof val === 'number' ? val : (val?.score ?? 0) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(e => e.key);
}

function getStrongestAreas(reponses) {
  if (!reponses || typeof reponses !== 'object') return [];
  const entries = Object.entries(reponses);
  if (entries.length === 0) return [];

  return entries
    .map(([key, val]) => ({ key, score: typeof val === 'number' ? val : (val?.score ?? 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(e => e.key);
}

async function learnFromAudit(serviceSupabase, audit) {
  try {
    const weak    = getWeakestAreas(audit.reponses);
    const strong  = getStrongestAreas(audit.reponses);
    const secteur = audit.secteur || 'general';
    const market  = audit.mode === 'af' ? 'af' : 'fr';

    // 1. Insérer une entrée de connaissance sur les patterns de ce secteur
    if (weak.length > 0) {
      await serviceSupabase.from('knowledge').upsert({
        categorie: 'apprentissage_auto',
        mode: market,
        market,
        secteur,
        titre: `Pattern faiblesse — ${secteur} (${market.toUpperCase()})`,
        contenu: `Dimensions les plus faibles observées dans le secteur ${secteur} : ${weak.join(', ')}. Score : ${audit.score}/100. Forces : ${strong.join(', ')}.`,
        tags: ['auto', secteur, market],
        priorite: 3,
        actif: true,
      }, { onConflict: 'categorie,secteur,market', ignoreDuplicates: false }).catch(() => {});
    }

    // 2. Mettre à jour le benchmark sectoriel (moyenne glissante)
    if (secteur !== 'general') {
      const { data: bench } = await serviceSupabase
        .from('benchmarks')
        .select('score_moyen, nb_entreprises')
        .eq('secteur', secteur)
        .eq('market', market)
        .single();

      if (bench) {
        const n = (bench.nb_entreprises || 0) + 1;
        const newMoyen = Math.round((bench.score_moyen * (n - 1) + audit.score) / n);
        await serviceSupabase
          .from('benchmarks')
          .update({ score_moyen: newMoyen, nb_entreprises: n, updated_at: new Date().toISOString() })
          .eq('secteur', secteur)
          .eq('market', market);
      } else {
        await serviceSupabase.from('benchmarks').insert({
          secteur,
          market,
          score_moyen: audit.score,
          score_top25: Math.round(audit.score * 1.2),
          score_top10: Math.round(audit.score * 1.4),
          nb_entreprises: 1,
          source: 'plateforme',
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.error('learnFromAudit error (non-bloquant) :', err.message);
  }
}

// ─── Route POST ─────────────────────────────────────────────────────────

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const { score, niveau, niveau_label, reponses, recommandations, mode, secteur } = body;

  if (score === undefined || !niveau || !mode) {
    return Response.json({ error: 'Champs requis manquants : score, niveau, mode.' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('audits')
    .insert({
      user_id:         user?.id || null,
      mode,
      score,
      niveau,
      reponses:        reponses || {},
      recommandations: recommandations || [],
      secteur:         secteur || null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Mise à jour du profil si user connecté
  if (user) {
    await supabase
      .from('profiles')
      .update({ audit_score: score, audit_level: niveau })
      .eq('id', user.id);

    // Planifier les emails de séquence post-audit
    const now = new Date();
    const j1 = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('email_sequences').insert([
      { user_id: user.id, sequence: 'j1_post_audit', step: 1, scheduled_at: j1 },
    ]).catch(() => {});
  }

  // Apprentissage IA — async, non bloquant
  try {
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    learnFromAudit(serviceSupabase, { ...data, reponses: reponses || {}, mode, secteur });
  } catch {}

  return Response.json({ success: true, id: data.id, score: data.score });
}
