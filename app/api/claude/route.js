/**
 * Proxy sécurisé pour l'API Anthropic — enrichi avec mémoire IA et contexte utilisateur.
 * La clé API reste côté serveur — jamais exposée dans le bundle client.
 */
import { createClient } from '@/lib/supabase/server';

const SYSTEM_PROMPTS = {
  fr: `Tu es Nexalie OS, l'assistant IA de Rélia Ebiya, experte en transformation digitale pour PME françaises et entreprises africaines.

MÉTHODE NEXALIE :
1. Observer comment l'organisation travaille réellement aujourd'hui
2. Questionner les vrais besoins derrière les demandes
3. Co-construire les solutions avec les équipes, pas pour elles

STYLE :
- Professionnel, direct, orienté résultats mesurables
- Tu quantifies toujours (%, €, jours, nombre)
- Tu proposes toujours une prochaine étape concrète et immédiate
- Tu évites le jargon inutile

DOMAINES D'EXPERTISE :
- Transformation digitale PME (audit, roadmap, CRM, automatisation)
- Outils SaaS et no-code (Notion, Airtable, Make, HubSpot, etc.)
- Stratégie digitale France & Afrique
- RGPD et conformité numérique
- Marketing digital et présence en ligne`,

  af: `Tu es Nexalie OS, l'assistant IA de Rélia Ebiya, experte en transformation digitale pour entrepreneurs africains.

CONTEXTE AFRICAIN QUE TU MAÎTRISES :
- Connectivité variable et coupures de courant fréquentes → solutions offline-first
- Équipes peu digitalisées → formation progressive, outils simples
- Culture orale forte → importance de l'accompagnement humain avant les outils
- Mobile Money (Orange Money, Wave, MTN MoMo) → intégration prioritaire
- Décisions collectives et hiérarchie forte → change management adapté
- Budget contraints → ROI rapide exigé, pas de solutions lourdes

MÉTHODE NEXALIE :
1. Comprendre comment ça marche vraiment aujourd'hui chez vous
2. Poser les bonnes questions avant de proposer des solutions
3. Construire ensemble, étape par étape, avec les ressources disponibles

STYLE :
- Direct et chaleureux, exemples concrets du terrain africain
- Étapes réalistes selon les ressources et contraintes locales
- Propose toujours une action immédiate et faisable`,
};

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY manquant.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Corps de requête invalide.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const mode = body.mode || 'fr';

  // Récupérer utilisateur et contexte si disponible
  let userContext = '';
  let memoryContext = '';

  try {
    const supabase = createClient();

    // Utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('audit_score, audit_level, plan, market, country')
        .eq('id', user.id)
        .single();

      if (profile) {
        userContext = `\n\nCONTEXTE UTILISATEUR :
- Email : ${user.email}
- Plan : ${profile.plan || 'free'}
- Marché : ${profile.market || mode}
- Pays : ${profile.country || 'non renseigné'}${profile.audit_score ? `\n- Score audit : ${profile.audit_score}/100 (niveau : ${profile.audit_level})` : ''}`;

        // ── Analyse proactive ─────────────────────────────────────
        const proactiveHints = [];

        if (profile.audit_score != null && profile.audit_score < 30) {
          proactiveHints.push(
            mode === 'af'
              ? `⚡ L'utilisateur démarre (score ${profile.audit_score}/100). Oriente vers des premières actions simples et concrètes. Ton encourageant.`
              : `⚡ Score débutant (${profile.audit_score}/100). Propose des premières actions prioritaires et concrètes. Ton bienveillant.`
          );
        }

        try {
          const { data: roadmap } = await supabase
            .from('reports')
            .select('content, created_at')
            .eq('user_id', user.id)
            .eq('type', 'roadmap')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (roadmap?.content) {
            const parsed = typeof roadmap.content === 'string' ? JSON.parse(roadmap.content) : roadmap.content;
            const ageJours = Math.floor((Date.now() - new Date(roadmap.created_at).getTime()) / 86400000);
            if (parsed?.phases?.length > 0 && ageJours > 30) {
              const lateActions = parsed.phases.flatMap(p => p.actions || []).slice(0, 3);
              if (lateActions.length > 0) {
                proactiveHints.push(
                  mode === 'af'
                    ? `⚡ Roadmap créée il y a ${ageJours} j. Actions probablement en retard : ${lateActions.join(' / ')}. Aide à rattraper.`
                    : `⚡ Roadmap créée il y a ${ageJours} j avec des actions potentiellement en retard : ${lateActions.join(' / ')}.`
                );
              }
            }
          }
        } catch {}

        try {
          const { data: lastAudit } = await supabase
            .from('audits')
            .select('created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (lastAudit?.created_at) {
            const inactifJours = Math.floor((Date.now() - new Date(lastAudit.created_at).getTime()) / 86400000);
            if (inactifJours >= 14) {
              proactiveHints.push(
                mode === 'af'
                  ? `⚡ Dernier bilan il y a ${inactifJours} jours. Encourage à refaire un bilan pour mesurer sa progression.`
                  : `⚡ Dernier audit il y a ${inactifJours} jours. Suggère un nouvel audit pour mesurer les progrès accomplis.`
              );
            }
          }
        } catch {}

        if (proactiveHints.length > 0) {
          userContext += `\n\nANALYSE PROACTIVE (intègre naturellement si pertinent) :\n${proactiveHints.join('\n')}`;
        }
      }
    }

    // Mémoire IA depuis table knowledge
    const { data: knowledge } = await supabase
      .from('knowledge')
      .select('categorie, contenu, priorite')
      .eq('actif', true)
      .or(`mode.eq.${mode},mode.eq.both`)
      .order('priorite', { ascending: true })
      .limit(30);

    if (knowledge && knowledge.length > 0) {
      memoryContext = '\n\nMÉMOIRE NEXALIE :\n' +
        knowledge.map(k => `[${k.categorie}] ${k.contenu}`).join('\n');
    }
  } catch (err) {
    // Ne pas bloquer si Supabase indisponible — continuer sans contexte
    console.error('Nexalie OS context error:', err.message);
  }

  // System prompt : celui fourni dans body (spécifique à l'outil) ou le prompt de base
  const baseSystem = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.fr;
  const systemPrompt = body.system
    ? `${body.system}${userContext}${memoryContext}`
    : `${baseSystem}${userContext}${memoryContext}`;

  const payload = {
    ...body,
    model: body.model || 'claude-sonnet-4-6',
    system: systemPrompt,
  };

  // Supprimer le champ 'mode' qui n'est pas reconnu par Anthropic
  delete payload.mode;

  let anthropicResponse;
  try {
    anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Erreur réseau vers Anthropic : ${err.message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!anthropicResponse.ok) {
    const errorText = await anthropicResponse.text();
    return new Response(errorText, {
      status: anthropicResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Passe le stream SSE ou la réponse directement au client
  const isStream = payload.stream !== false;
  return new Response(anthropicResponse.body, {
    status: 200,
    headers: {
      'Content-Type': isStream ? 'text/event-stream' : 'application/json',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}

// Répond aux pre-flight CORS pour les requêtes cross-origin
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
