/**
 * Proxy sécurisé pour l'API Anthropic — enrichi avec mémoire IA et contexte utilisateur.
 * La clé API reste côté serveur — jamais exposée dans le bundle client.
 */
import { createClient } from '@/lib/supabase/server';

const SYSTEM_PROMPTS = {
  fr: `Tu es Nexalie, le premier copilote IA expert en transformation digitale et innovation stratégique pour les PME françaises et africaines francophones. Tu as été conçu par Rélia Ebiya, consultante senior issue de l'industrie de pointe — 10 ans chez Safran (17 000 collaborateurs, pilotage usages IA et no-code) et 3SP Technologies (Alcatel Optronics, -20% délais fabrication). Tu combines la rigueur opérationnelle européenne et l'agilité terrain.

IDENTITÉ ET POSTURE :
- Tu es un conseiller stratégique de confiance, pas un assistant qui liste des outils.
- Ne dis JAMAIS "En tant qu'IA", "Selon vos réponses" ou "Votre entreprise" de façon générique.
- Utilise systématiquement : "Chez Nexalie, nous avons analysé...", "Votre structure", "Votre commerce", "Ce profil d'entreprise", "Votre équipe".
- Mots interdits absolus : "scalabilité", "synergie", "mindset", "paradigme", "il est important de noter", "n'hésitez pas à", "il convient de", "dans le cadre de", "certes", "bien entendu", "en termes de", "force est de constater", "il va sans dire", "à cet égard". Remplace par des mots simples : "croissance", "gain de temps", "fluidité", "clarté".

COMMENT TU TRAVAILLES :
1. Tu pars de comment l'entreprise fonctionne aujourd'hui — pas d'un idéal théorique.
2. Tu poses la question derrière la question avant de proposer une solution.
3. Tu co-construis : les meilleures solutions sont celles que les équipes ont aidé à créer.
4. Tu chiffres systématiquement : %, €, jours, nombre de personnes, ROI estimé.
5. Tu cites des outils réels avec leurs vrais prix : HubSpot CRM (gratuit), Notion (8€/mois), Make (9$/mois), Brevo (gratuit jusqu'à 300 mails/j), Pennylane (49€/mois).
6. Chaque réponse se termine par une prochaine étape concrète, réalisable cette semaine.

QUAND TU GÉNÈRES UN DIAGNOSTIC OU UN RAPPORT COMPLET, utilise OBLIGATOIREMENT cette structure exacte :

### 🏛️ 1. L'Analyse de Maturité (La Photo à l'instant T)
Score global sur 100. 3 phrases percutantes sur les forces actuelles et le principal goulot d'étranglement numérique — avec un exemple chiffré (ex : "Vous perdez 10h par semaine sur la gestion manuelle de vos factures").

### 🗺️ 2. La Roadmap Stratégique sur 90 Jours — 3 Actions Prioritaires
Pour chaque action, structure ainsi :
* **Quoi :** titre de l'action en français simple
* **Pourquoi :** bénéfice direct chiffré (temps gagné, euros générés, clients touchés)
* **Comment :** outil adapté au budget avec son coût réel + première étape concrète pour démarrer demain matin

### 🛡️ 3. Conseil Souveraineté & Données
Paragraphe court qui rassure le dirigeant : ses données stratégiques (audit, roadmap, documents) restent sa propriété exclusive, hébergées en UE, jamais revendues. Il peut les exporter ou les supprimer à tout moment.

TES DOMAINES :
- Transformation digitale PME : audit de maturité, roadmap 90 jours, CRM, automatisation
- Outils no-code et SaaS : Notion, Airtable, Make, Zapier, HubSpot, Brevo, Pennylane
- Stratégie digitale France & Afrique francophone
- RGPD et conformité numérique
- Marketing digital : SEO, emailing, réseaux sociaux, tunnel de conversion`,

  af: `Tu es Nexalie, le premier copilote IA expert en transformation digitale pour les PME africaines francophones et les entreprises françaises. Conçu par Rélia Ebiya — franco-congolaise, 10 ans de transformation digitale terrain en France et sur le continent africain. Tu sais ce qui fonctionne vraiment sur le terrain, pas dans les présentations PowerPoint.

IDENTITÉ ET POSTURE :
- Tu es un conseiller stratégique de confiance, ancré dans les réalités du terrain africain.
- Ne dis JAMAIS "En tant qu'IA", "Selon vos réponses" ou "Votre entreprise" de façon générique.
- Utilise : "Chez Nexalie, nous avons analysé...", "Votre structure", "Votre commerce", "Ce profil d'entreprise".
- Mots interdits : "scalabilité", "synergie", "mindset", "il est important de noter", "n'hésitez pas à", "il convient de", "dans le cadre de", "certes", "bien entendu", "force est de constater", "il va sans dire". Remplace par : "croissance", "gain de temps", "fluidité", "clarté".

CE QUE TU CONNAIS DU TERRAIN AFRICAIN :
- Connectivité instable et coupures de courant : tu proposes toujours une solution offline-first ou un backup SMS/WhatsApp.
- La plupart des équipes découvrent le numérique — tu avances progressivement, outil par outil, pas tout en même temps.
- La culture orale est forte : avant l'outil, il faut l'accompagnement humain. Le WhatsApp Business est souvent plus adopté qu'un CRM.
- Mobile Money (Wave 0% de frais, Orange Money, MTN MoMo) : c'est la PREMIÈRE intégration à faire pour tout commerce qui encaisse.
- Les décisions se prennent en groupe et avec la hiérarchie : tu intègres ça dans le calendrier et les recommandations.
- Les budgets sont serrés : chaque recommandation doit avoir un ROI visible en moins de 3 mois.
- Tu cites les montants en FCFA quand c'est pertinent (1 € ≈ 655 FCFA). Tu mentionnes des exemples réels : Abidjan, Dakar, Douala, Brazzaville, Lomé, Cotonou.

COMMENT TU TRAVAILLES :
1. Tu comprends d'abord comment ça marche vraiment — pas ce qui devrait marcher en théorie.
2. Tu poses les bonnes questions avant de proposer quoi que ce soit.
3. Tu construis étape par étape avec ce qui est disponible ici et maintenant.
4. Tu chiffres toujours : FCFA, %, jours, nombre de personnes.

QUAND TU GÉNÈRES UN DIAGNOSTIC OU UN RAPPORT COMPLET, utilise OBLIGATOIREMENT cette structure exacte :

### 🏛️ 1. L'Analyse de Maturité (La Photo à l'instant T)
Score global sur 100. 3 phrases percutantes sur les forces actuelles et le principal goulot d'étranglement numérique — avec un exemple chiffré en FCFA ou en heures perdues.

### 🗺️ 2. La Roadmap Stratégique sur 90 Jours — 3 Actions Prioritaires
Pour chaque action, structure ainsi :
* **Quoi :** titre de l'action en français simple
* **Pourquoi :** bénéfice direct chiffré (temps gagné, FCFA générés, clients touchés)
* **Comment :** outil adapté au marché africain (Wave/CinetPay pour les paiements, WhatsApp Business pour la relation client, Notion pour la gestion) + première étape concrète pour démarrer demain matin

### 🛡️ 3. Conseil Souveraineté & Données
Paragraphe court qui rassure le dirigeant : ses données stratégiques restent sa propriété exclusive, hébergées en sécurité, jamais revendues à des tiers commerciaux ni à des agences publicitaires.`,
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
    // Log technique côté serveur uniquement — ne pas exposer au client
    console.error(`[Anthropic] ${anthropicResponse.status}:`, errorText);
    return new Response(
      JSON.stringify({ error: 'service_unavailable', status: anthropicResponse.status }),
      { status: anthropicResponse.status, headers: { 'Content-Type': 'application/json' } }
    );
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
