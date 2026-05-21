import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const FROM_NOREPLY = 'Nexalie <noreply@nexalie.co>';
const FROM_RELIA = 'Rélia — Nexalie <relia@nexalie.co>';
const FROM_RAPPORTS = 'Nexalie Rapports <rapports@nexalie.co>';

// ─── Templates ──────────────────────────────────────────────────────

function baseLayout(content, accentColor = '#4EC9B0', navy = '#0A1628') {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8FAFC; }
        .wrapper { max-width: 580px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; }
        .header { background: ${navy}; padding: 28px 40px; }
        .logo { color: #fff; font-size: 20px; font-style: italic; letter-spacing: -0.5px; }
        .logo-ai { color: ${accentColor}; font-family: monospace; font-size: 9px; letter-spacing: 2px; margin-left: 4px; }
        .body { padding: 36px 40px; }
        .h1 { font-size: 22px; font-weight: 300; color: ${navy}; margin-bottom: 14px; line-height: 1.3; }
        .p { font-size: 14px; color: #6B7A94; line-height: 1.8; margin-bottom: 16px; }
        .score-box { background: #F8FAFC; border: 1px solid rgba(0,0,0,0.07); border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        .score-num { font-size: 40px; font-weight: 800; color: ${accentColor}; line-height: 1; }
        .score-sub { font-size: 12px; color: #9CA3AF; margin-top: 4px; }
        .btn { display: block; background: ${accentColor}; color: #fff; text-align: center; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 700; margin: 20px 0; }
        .btn-outline { display: block; background: transparent; color: ${navy}; text-align: center; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 700; border: 2px solid ${navy}; margin: 12px 0; }
        .feature { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
        .feature-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
        .feature-text { font-size: 13px; color: #374151; line-height: 1.6; }
        .divider { height: 1px; background: #F3F4F6; margin: 24px 0; }
        .footer { background: ${navy}; padding: 20px 40px; text-align: center; }
        .footer p { color: rgba(255,255,255,0.35); font-size: 11px; line-height: 1.8; }
        .footer a { color: ${accentColor}; text-decoration: none; }
        .highlight { color: ${navy}; font-weight: 700; }
        .accent { color: ${accentColor}; }
        .comparison-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .comparison-table th { background: #F8FAFC; padding: 10px 14px; font-size: 12px; color: ${navy}; font-weight: 700; text-align: left; border-bottom: 1px solid #E5E7EB; }
        .comparison-table td { padding: 10px 14px; font-size: 12px; color: #6B7A94; border-bottom: 1px solid #F3F4F6; }
        .comparison-table tr.nexali td { color: ${accentColor}; font-weight: 700; background: rgba(78,201,176,0.05); }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="logo">Nexalie</span><span class="logo-ai">AI</span>
        </div>
        <div class="body">${content}</div>
        <div class="footer">
          <p>
            Nexalie · nexalie.co<br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/legal">Se désabonner</a> ·
            <a href="${process.env.NEXT_PUBLIC_APP_URL}">Accéder à ma plateforme</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Séquence 1 — Bienvenue (J+0)
function welcomeEmail(name, isAf) {
  const auditLabel = isAf ? 'Bilan Numérique' : 'Audit de Maturité Digitale';
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';

  const content = `
    <h1 class="h1">Bonjour ${name}, bienvenue sur Nexalie&nbsp;!</h1>
    <p class="p">Votre compte est actif. Vous avez maintenant accès à votre plateforme de transformation digitale.</p>
    <p class="p">Je vous recommande de commencer par votre <strong class="highlight">${auditLabel} gratuit</strong> — 3 minutes pour obtenir votre score de référence et 5 recommandations personnalisées.</p>

    <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 20px 0;">
      ${[
        { icon: '📊', title: auditLabel, desc: 'Évaluez votre niveau digital en 3 min.' },
        { icon: '🗺️', title: isAf ? "Plan d'Action Digital" : 'Roadmap Builder', desc: 'Votre feuille de route IA sur-mesure.' },
        { icon: '🤖', title: 'Nexalie OS', desc: 'Votre assistant IA disponible 24/7.' },
      ].map(f => `
        <div class="feature">
          <span class="feature-icon">${f.icon}</span>
          <div class="feature-text"><strong style="color: ${navy};">${f.title}</strong><br>${f.desc}</div>
        </div>
      `).join('')}
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/audit" class="btn" style="background: ${accent};">
      Faire mon ${auditLabel} maintenant →
    </a>

    <div class="divider"></div>
    <p class="p" style="font-size: 13px;">À votre disposition pour toute question,<br>
    <strong class="highlight">Rélia</strong> — Fondatrice Nexalie</p>
  `;

  return baseLayout(content, accent, navy);
}

// Séquence 2 — Relance audit J+3
function reminderAuditEmail(name, isAf) {
  const auditLabel = isAf ? 'votre Bilan Numérique' : 'votre audit digital';
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';

  const content = `
    <h1 class="h1">Vous n'avez pas encore fait ${auditLabel}.</h1>
    <p class="p">Il y a 3 jours, vous avez rejoint Nexalie. Sans diagnostic de départ, votre espace ne peut pas vous proposer de recommandations sur-mesure.</p>
    <p class="p">L'audit prend <strong class="highlight">3 minutes</strong>. Pas de compte à créer — vous êtes déjà connecté.</p>

    <div class="score-box">
      <div class="score-num" style="color: ${accent};">?</div>
      <div class="score-sub">Votre score de maturité digitale — inconnu</div>
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/audit" class="btn" style="background: ${accent};">
      Obtenir mon score maintenant →
    </a>

    <p class="p" style="font-size: 12px; color: #9CA3AF; text-align: center;">Gratuit · 3 minutes · Sans engagement</p>
  `;

  return baseLayout(content, accent, navy);
}

// Séquence 3 — Découvrir Roadmap J+7
function discoverRoadmapEmail(name, score, isAf) {
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';
  const roadmapLabel = isAf ? "Plan d'Action Digital" : 'Roadmap Builder';

  const content = `
    <h1 class="h1">${score ? `Votre score : ${score}/100.` : 'Et maintenant ?'} La prochaine étape.</h1>
    <p class="p">Le ${roadmapLabel} IA analyse votre score et génère une feuille de route sur-mesure : quoi faire en priorité, dans quel ordre, avec quel budget estimé.</p>

    <div style="background: #F8FAFC; border-left: 3px solid ${accent}; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 20px 0;">
      <p style="font-size: 13px; color: ${navy}; font-weight: 700; margin-bottom: 8px;">Ce que génère le ${roadmapLabel} :</p>
      ${['Actions prioritaires sur 90 jours', 'Plan à 6 mois et 12 mois', 'Budget estimé par action', 'Outils recommandés par cas'].map(item =>
        `<p style="font-size: 13px; color: #374151; margin-bottom: 4px;">✓ ${item}</p>`
      ).join('')}
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" class="btn" style="background: ${accent};">
      Débloquer le ${roadmapLabel} →
    </a>

    <p class="p" style="font-size: 12px; color: #9CA3AF; text-align: center;">Disponible à partir du plan Pro · ${isAf ? '85 000 FCFA/mois' : '129€/mois'}</p>
  `;

  return baseLayout(content, accent, navy);
}

// Séquence 4 — Rapport généré
function reportGeneratedEmail(name, toolName, score, level, pdfUrl, isAf) {
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';

  const content = `
    <h1 class="h1">Votre rapport est prêt.</h1>
    <p class="p">Votre <strong class="highlight">${toolName}</strong> vient d'être généré. Voici votre résultat :</p>

    ${score !== undefined ? `
      <div class="score-box">
        <div class="score-num" style="color: ${accent};">${score}</div>
        <div class="score-sub">Score de maturité digitale · ${level || ''}</div>
      </div>
    ` : ''}

    ${pdfUrl ? `
      <a href="${pdfUrl}" class="btn" style="background: ${accent};">
        Télécharger mon rapport PDF →
      </a>
    ` : `
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/platform" class="btn" style="background: ${accent};">
        Voir mon rapport →
      </a>
    `}

    <div class="divider"></div>
    <p class="p" style="font-size: 13px;">Votre rapport contient vos recommandations personnalisées. Si vous avez des questions, répondez directement à cet email.</p>
    <p class="p" style="font-size: 13px;"><strong class="highlight">Rélia</strong> — Fondatrice Nexalie</p>
  `;

  return baseLayout(content, accent, navy);
}

// Séquence 5 — Upgrade (plan gratuit > 7 jours)
function upgradeEmail(name, isAf) {
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';
  const proPrice = isAf ? '85 000 FCFA/mois' : '129€/mois';

  const content = `
    <h1 class="h1">Vous utilisez Nexalie depuis une semaine.</h1>
    <p class="p">Vous avez accès aux fonctionnalités de base. Voici ce que vous débloquez avec le plan Pro :</p>

    <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 20px 0;">
      ${[
        { icon: '🗺️', feat: isAf ? "Plan d'Action Digital IA" : 'Roadmap Builder IA', desc: 'Feuille de route sur-mesure générée en 30s.' },
        { icon: '📈', feat: 'Suivi de progression', desc: 'Graphique d\'évolution + benchmarks sectoriels.' },
        { icon: '🏅', feat: 'Badge Digital Ready', desc: 'Certificat vérifiable avec QR code.' },
        { icon: '🤖', feat: 'Nexalie OS illimité', desc: 'Chat IA sans limite quotidienne.' },
        { icon: '📚', feat: 'Toutes les ressources', desc: isAf ? 'Guides OHADA, Mobile Money, données.' : 'Templates RGPD, CDC, contrats web.' },
      ].map(f => `
        <div class="feature">
          <span class="feature-icon">${f.icon}</span>
          <div class="feature-text"><strong style="color: ${navy};">${f.feat}</strong><br>${f.desc}</div>
        </div>
      `).join('')}
    </div>

    <div class="divider"></div>
    <p class="p" style="text-align: center; font-size: 13px; font-weight: 700; color: ${navy};">Nexalie Pro vs. les alternatives</p>

    <table class="comparison-table">
      <thead>
        <tr><th>Solution</th><th>Prix</th><th>Limite</th></tr>
      </thead>
      <tbody>
        <tr><td>McKinsey Digital</td><td>50 000€+</td><td>Grandes entreprises uniquement</td></tr>
        <tr><td>Consultant freelance</td><td>800€/jour</td><td>Trop cher, pas scalable</td></tr>
        <tr class="nexali"><td>Nexalie Pro</td><td>${proPrice}</td><td>✅ Même valeur, 100× moins cher</td></tr>
      </tbody>
    </table>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" class="btn" style="background: ${accent};">
      Passer au plan Pro →
    </a>

    <p class="p" style="font-size: 12px; color: #9CA3AF; text-align: center;">
      ${isAf ? 'Mobile Money · Orange Money · MTN MoMo · Wave' : 'Carte bancaire · Virement SEPA · Sans engagement'}
    </p>
  `;

  return baseLayout(content, accent, navy);
}

// Séquence 7 — J+1 post-audit (suivi lendemain)
function postAuditFollowupEmail(name, score, niveau, isAf) {
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';
  const niveauLabel = { debutant: 'Débutant Digital', intermediaire: 'Intermédiaire', avance: 'Avancé', expert: 'Expert Digital' }[niveau] || niveau;

  const content = `
    <h1 class="h1">Votre audit d'hier — un point 24h après.</h1>
    <p class="p">Hier, vous avez obtenu un score de <strong class="highlight">${score}/100 — ${niveauLabel}</strong>. Avez-vous eu le temps de lire vos recommandations ?</p>

    <div class="score-box">
      <div class="score-num" style="color: ${accent};">${score}</div>
      <div class="score-sub">Score de maturité digitale · ${niveauLabel}</div>
    </div>

    <p class="p">Votre rapport PDF complet est disponible dans votre espace. Il contient vos 5 recommandations prioritaires et un plan d'action sur 90 jours.</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/platform" class="btn" style="background: ${accent};">
      Accéder à mon rapport →
    </a>

    <div class="divider"></div>
    <p class="p" style="font-size: 13px;">Une question sur votre score ? Répondez directement à cet email.<br>
    <strong class="highlight">Rélia</strong> — Fondatrice Nexalie</p>
  `;

  return baseLayout(content, accent, navy);
}

// Séquence 8 — Récap mensuel progression (Pro)
function monthlyProgressEmail(name, audits, isAf) {
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';
  const latestScore = audits?.[0]?.score ?? 0;
  const firstScore = audits?.[audits.length - 1]?.score ?? latestScore;
  const delta = latestScore - firstScore;

  const content = `
    <h1 class="h1">Votre progression ce mois — récapitulatif.</h1>
    <p class="p">Voici un bilan de votre évolution de maturité digitale depuis le début de votre abonnement Nexalie Pro.</p>

    <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 20px 0; display: flex; gap: 16px;">
      <div style="flex: 1; text-align: center;">
        <div class="score-num" style="color: ${accent}; font-size: 28px;">${firstScore}</div>
        <div class="score-sub">Score initial</div>
      </div>
      <div style="flex: 0; font-size: 24px; align-self: center; color: #D1D5DB;">→</div>
      <div style="flex: 1; text-align: center;">
        <div class="score-num" style="color: ${delta >= 0 ? '#10B981' : '#EF4444'}; font-size: 28px;">${latestScore}</div>
        <div class="score-sub">Score actuel ${delta > 0 ? `(+${delta} pts)` : delta < 0 ? `(${delta} pts)` : '(stable)'}</div>
      </div>
    </div>

    <p class="p">${delta > 0
      ? `Excellent travail — vous avez progressé de ${delta} points ce mois. Continuez sur cette lancée !`
      : delta === 0
        ? 'Votre score est stable ce mois. Avez-vous appliqué les recommandations de votre dernier audit ?'
        : 'Ce mois a été challengeant. Regardons ensemble quels axes prioriser pour rebondir.'
    }</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/platform/progress" class="btn" style="background: ${accent};">
      Voir mon graphique de progression →
    </a>

    <div class="divider"></div>
    <p class="p" style="font-size: 13px;"><strong class="highlight">Rélia</strong> — Fondatrice Nexalie</p>
  `;

  return baseLayout(content, accent, navy);
}

// Séquence 6 — Confirmation paiement
function paymentConfirmedEmail(name, plan, isAf) {
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';
  const planLabel = plan === 'pro' ? 'Pro' : plan === 'institutions' ? 'Institutions' : 'Starter';

  const content = `
    <h1 class="h1">Paiement confirmé. Bienvenue sur Nexalie ${planLabel}&nbsp;!</h1>
    <p class="p">Votre accès est immédiatement actif. Voici ce que vous pouvez faire maintenant :</p>

    <div style="background: ${accent}10; border: 2px solid ${accent}; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="font-size: 11px; color: ${accent}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Plan activé</p>
      <p style="font-size: 28px; font-weight: 800; color: ${navy};">Nexalie ${planLabel}</p>
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/platform/roadmap" class="btn" style="background: ${accent};">
      ${isAf ? "Créer mon Plan d'Action Digital →" : 'Créer ma Roadmap IA →'}
    </a>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/platform" class="btn-outline" style="color: ${navy}; border-color: ${navy};">
      Accéder à ma plateforme
    </a>

    <div class="divider"></div>
    <p class="p" style="font-size: 13px;">Merci pour votre confiance.<br>
    <strong class="highlight">Rélia</strong> — Fondatrice Nexalie</p>
  `;

  return baseLayout(content, accent, navy);
}

// Séquence 7 — Action hebdomadaire (lundi 8h)
function weeklyActionEmail(name, nextAction, score, progression, secteur, isAf) {
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';
  const scoreColor = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';

  const encouragements = isAf ? [
    'Tu avances ! Chaque action compte.',
    'Cette semaine, une action = un pas de plus.',
    'Continue, tu bâtis quelque chose de solide.',
    'Ta progression inspire. Ne lâche pas.',
  ] : [
    'Vous progressez régulièrement. Continuez.',
    'Une action cette semaine, une de moins sur votre roadmap.',
    'Votre transformation digitale avance à chaque étape.',
    'Votre engagement paie. Chaque action compte.',
  ];
  const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  const content = `
    <h1 class="h1">${isAf ? `Ton action de cette semaine, ${name}` : `Votre action de la semaine, ${name}`}</h1>
    <p class="p">${isAf ? 'Voici ce que Nexalie te recommande de faire cette semaine pour avancer sur ton plan numérique.' : 'Voici l\'action prioritaire de votre roadmap pour cette semaine.'}</p>

    ${nextAction ? `
    <div style="background: ${accent}10; border-left: 4px solid ${accent}; border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 20px 0;">
      <p style="font-size: 11px; font-weight: 700; color: ${accent}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">ACTION PRIORITAIRE DE LA SEMAINE</p>
      <p style="font-size: 16px; color: ${navy}; font-weight: 600; line-height: 1.5;">${nextAction}</p>
    </div>
    ` : `
    <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="font-size: 14px; color: #6B7A94;">Accédez à votre roadmap pour voir vos prochaines actions planifiées.</p>
    </div>
    `}

    <div style="background: #F8FAFC; border-radius: 12px; padding: 16px 20px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <p style="font-size: 11px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">SCORE ACTUEL</p>
        <p style="font-size: 28px; font-weight: 800; color: ${scoreColor}; line-height: 1;">${score}<span style="font-size: 14px; font-weight: 400; color: #9CA3AF;">/100</span></p>
      </div>
      ${secteur ? `<div style="padding: 6px 14px; background: ${accent}15; border-radius: 20px;"><p style="font-size: 12px; font-weight: 600; color: ${accent};">${secteur}</p></div>` : ''}
    </div>

    <p class="p" style="font-style: italic; color: #374151;">"${encouragement}"</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/platform/roadmap" class="btn" style="background: ${accent};">
      ${isAf ? 'Voir mon plan d\'action →' : 'Voir ma roadmap →'}
    </a>

    <div class="divider"></div>
    <p class="p" style="font-size: 13px;"><strong class="highlight">Rélia</strong> — Fondatrice Nexalie</p>
  `;
  return baseLayout(content, accent, navy);
}

// Séquence 8 — Rapport mensuel enrichi (1er du mois)
function monthlyReportEmail(name, data, isAf) {
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';
  const { currentScore = 0, previousScore = 0, topActions = [], nextActions = [], benchmarkScore = null, secteur = '', plan = 'free' } = data;
  const delta = currentScore - previousScore;
  const deltaColor = delta > 0 ? '#10B981' : delta < 0 ? '#EF4444' : '#6B7A94';
  const deltaStr = delta > 0 ? `+${delta}` : `${delta}`;

  const levelMsg = isAf
    ? (currentScore >= 70 ? `${name}, tu es dans le top des entreprises numérisées ! Continue.`
       : currentScore >= 40 ? `${name}, bonne dynamique. Tu avances vers le niveau Leader.`
       : `${name}, chaque pas compte. Tu construis ta transformation numérique étape par étape.`)
    : (currentScore >= 70 ? `${name}, vous figurez parmi les entreprises les plus avancées. Continuez sur cette lancée.`
       : currentScore >= 40 ? `${name}, vous progressez bien. La prochaine étape : atteindre le niveau Avancé.`
       : `${name}, votre transformation digitale est lancée. Chaque action vous rapproche du niveau suivant.`);

  const content = `
    <h1 class="h1">Votre rapport mensuel Nexalie — ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h1>

    <div style="display: flex; gap: 12px; margin: 20px 0;">
      <div style="flex: 1; background: #F8FAFC; border-radius: 12px; padding: 16px; text-align: center;">
        <p style="font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">SCORE DU MOIS</p>
        <p style="font-size: 32px; font-weight: 800; color: ${accent}; line-height: 1;">${currentScore}</p>
        <p style="font-size: 11px; color: #9CA3AF;">sur 100</p>
      </div>
      <div style="flex: 1; background: #F8FAFC; border-radius: 12px; padding: 16px; text-align: center;">
        <p style="font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">ÉVOLUTION</p>
        <p style="font-size: 32px; font-weight: 800; color: ${deltaColor}; line-height: 1;">${previousScore > 0 ? deltaStr : '—'}</p>
        <p style="font-size: 11px; color: #9CA3AF;">${previousScore > 0 ? 'points ce mois' : 'premier mois'}</p>
      </div>
      ${benchmarkScore ? `
      <div style="flex: 1; background: #F8FAFC; border-radius: 12px; padding: 16px; text-align: center;">
        <p style="font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">BENCHMARK</p>
        <p style="font-size: 32px; font-weight: 800; color: #7B5EA7; line-height: 1;">${benchmarkScore}</p>
        <p style="font-size: 11px; color: #9CA3AF;">moyenne secteur</p>
      </div>
      ` : ''}
    </div>

    <p class="p" style="font-style: italic; color: ${navy};">"${levelMsg}"</p>

    ${topActions.length > 0 ? `
    <div style="margin: 20px 0;">
      <p style="font-size: 12px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">✓ Actions complétées ce mois</p>
      ${topActions.slice(0, 3).map(a => `
        <div style="display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F3F4F6;">
          <span style="color: #10B981; font-size: 14px; flex-shrink: 0;">✓</span>
          <p style="font-size: 13px; color: #374151;">${a}</p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${nextActions.length > 0 ? `
    <div style="margin: 20px 0;">
      <p style="font-size: 12px; font-weight: 700; color: ${accent}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">→ Prochaines actions prioritaires</p>
      ${nextActions.slice(0, 3).map((a, i) => `
        <div style="display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F3F4F6;">
          <span style="color: ${accent}; font-size: 13px; font-weight: 700; flex-shrink: 0; font-family: monospace;">${i + 1}.</span>
          <p style="font-size: 13px; color: #374151;">${a}</p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${plan === 'free' ? `
    <div style="background: ${accent}10; border: 1.5px solid ${accent}; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="font-size: 13px; color: ${navy}; margin-bottom: 12px;">Ce rapport contient une version basique. Passez <strong>Pro</strong> pour accéder au rapport complet 3 pages avec benchmark sectoriel détaillé.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="background: ${accent}; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block;">Passer Pro →</a>
    </div>
    ` : ''}

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/platform/progress" class="btn" style="background: ${accent};">
      ${isAf ? 'Voir toute ma progression →' : 'Voir ma progression complète →'}
    </a>

    <div class="divider"></div>
    <p class="p" style="font-size: 13px;"><strong class="highlight">Rélia</strong> — Fondatrice Nexalie</p>
  `;
  return baseLayout(content, accent, navy);
}

// ─── Route handler ───────────────────────────────────────────────────

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const body = await request.json();
  const { type, reportData, userId, plan } = body;

  // Pour certains types, on peut utiliser userId sans session (webhooks)
  let email, name, isAf;

  if (session) {
    email = session.user.email;
    name = session.user.user_metadata?.full_name || email.split('@')[0];
  } else if (userId) {
    // Appel interne depuis un webhook
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data: user } = await serviceClient.auth.admin.getUserById(userId);
    email = user?.user?.email;
    name = user?.user?.user_metadata?.full_name || email?.split('@')[0] || 'Utilisateur';

    const { data: profile } = await serviceClient.from('profiles').select('mode').eq('id', userId).single();
    isAf = profile?.mode === 'af';
  }

  if (!email) {
    return Response.json({ error: 'Email introuvable' }, { status: 400 });
  }

  // Détecter le mode si pas encore défini
  if (isAf === undefined && session) {
    const { data: profile } = await supabase.from('profiles').select('mode').eq('id', session.user.id).single();
    isAf = profile?.mode === 'af';
  }

  const accent = isAf ? '#E88C32' : '#4EC9B0';

  try {
    let emailPayload;

    switch (type) {
      case 'welcome':
        emailPayload = {
          from: FROM_RELIA,
          to: email,
          subject: 'Bienvenue sur Nexalie — votre espace est prêt',
          html: welcomeEmail(name, isAf),
        };
        break;

      case 'reminder_audit':
        emailPayload = {
          from: FROM_RELIA,
          to: email,
          subject: 'Vous n\'avez pas encore fait votre audit digital',
          html: reminderAuditEmail(name, isAf),
        };
        break;

      case 'discover_roadmap':
        emailPayload = {
          from: FROM_RELIA,
          to: email,
          subject: `${isAf ? "Votre Plan d'Action Digital" : 'Votre Roadmap'} est disponible`,
          html: discoverRoadmapEmail(name, reportData?.score, isAf),
        };
        break;

      case 'report_generated':
        emailPayload = {
          from: FROM_RAPPORTS,
          to: email,
          subject: `Votre rapport ${reportData?.toolName || 'Nexalie'} est prêt`,
          html: reportGeneratedEmail(name, reportData?.toolName, reportData?.score, reportData?.level, reportData?.pdfUrl, isAf),
        };
        break;

      case 'upgrade_prompt':
        emailPayload = {
          from: FROM_RELIA,
          to: email,
          subject: 'Débloquez tout Nexalie — une semaine ensemble',
          html: upgradeEmail(name, isAf),
        };
        break;

      case 'payment_confirmed':
        emailPayload = {
          from: FROM_RELIA,
          to: email,
          subject: `Paiement confirmé — Nexalie ${plan || 'Pro'} activé`,
          html: paymentConfirmedEmail(name, plan || 'pro', isAf),
        };
        break;

      case 'j1_post_audit':
        emailPayload = {
          from: FROM_RELIA,
          to: email,
          subject: `Votre score ${reportData?.score ?? ''}/100 — que faire maintenant ?`,
          html: postAuditFollowupEmail(name, reportData?.score ?? 0, reportData?.niveau ?? 'intermediaire', isAf),
        };
        break;

      case 'monthly_progress_pro':
        emailPayload = {
          from: FROM_RELIA,
          to: email,
          subject: 'Votre récap mensuel de progression Nexalie',
          html: monthlyProgressEmail(name, reportData?.audits ?? [], isAf),
        };
        break;

      case 'weekly_action':
        emailPayload = {
          from: FROM_RELIA,
          to: email,
          subject: isAf ? 'Ton action de cette semaine — Nexalie' : 'Votre action de la semaine — Nexalie',
          html: weeklyActionEmail(
            name,
            reportData?.nextAction ?? null,
            reportData?.score ?? 0,
            reportData?.progression ?? 0,
            reportData?.secteur ?? '',
            isAf
          ),
        };
        break;

      case 'rapport_mensuel':
        emailPayload = {
          from: FROM_RAPPORTS,
          to: email,
          subject: `Votre rapport mensuel Nexalie — ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
          html: monthlyReportEmail(name, reportData ?? {}, isAf),
        };
        break;

      default:
        return Response.json({ error: `Type d'email inconnu : ${type}` }, { status: 400 });
    }

    await resend.emails.send(emailPayload);

    // Logger dans email_sequences si user authentifié
    if (session) {
      await supabase.from('email_sequences').insert({
        user_id: session.user.id,
        sequence: type,
        step: 1,
        scheduled_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
      }).catch(() => {});
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
