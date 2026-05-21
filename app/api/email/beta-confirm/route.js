import { Resend } from 'resend';

const RELIA_EMAIL = 'relia.ebiya@gmail.com';
const TOTAL_SPOTS = 20;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Corps invalide' }, { status: 400 });
  }

  const { nom, email, entreprise, remaining } = body;

  if (!email) {
    return Response.json({ error: 'Email requis' }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const isWaitlist = remaining <= 0;

  // 1. Email de confirmation au bêta-testeur
  try {
    await resend.emails.send({
      from: 'Rélia — Nexalie <relia@nexalie.co>',
      to: email,
      subject: isWaitlist
        ? 'Liste d\'attente Nexalie Beta — vous êtes inscrit(e) !'
        : '🎉 Place bêta réservée — Nexalie vous ouvre ses portes',
      html: `
        <!DOCTYPE html>
        <html><head><meta charset="utf-8" /></head>
        <body style="font-family: -apple-system, sans-serif; background: #F8FAFC;">
          <div style="max-width: 540px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden;">
            <div style="background: #0A1628; padding: 24px 36px; display: flex; align-items: center; gap: 8px;">
              <span style="color: #fff; font-size: 20px; font-style: italic;">Nexalie</span>
              <span style="color: #4EC9B0; font-family: monospace; font-size: 9px; letter-spacing: 2px;">AI</span>
              <span style="margin-left: auto; background: #4EC9B0; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px;">BETA</span>
            </div>
            <div style="padding: 36px;">
              ${isWaitlist ? `
                <h2 style="font-size: 22px; font-weight: 300; color: #0A1628; margin-bottom: 12px;">
                  Bonjour ${nom}, vous êtes sur la liste d'attente !
                </h2>
                <p style="font-size: 14px; color: #6B7A94; line-height: 1.8; margin-bottom: 14px;">
                  Toutes les places bêta sont prises pour le moment. Vous êtes inscrit(e) en priorité — je vous contacterai dès qu'une place se libère.
                </p>
              ` : `
                <h2 style="font-size: 22px; font-weight: 300; color: #0A1628; margin-bottom: 12px;">
                  Bonjour ${nom}, votre place bêta est réservée ! 🎉
                </h2>
                <div style="background: rgba(78,201,176,0.08); border: 2px solid #4EC9B0; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
                  <p style="font-size: 11px; color: #4EC9B0; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px;">Ce que vous obtenez</p>
                  <p style="font-size: 16px; font-weight: 700; color: #0A1628; margin: 0;">Accès Pro Nexalie — 3 mois offerts</p>
                  <p style="font-size: 12px; color: #6B7A94; margin: 6px 0 0;">Roadmap IA · PDF · Certification · Nexalie OS illimité</p>
                </div>
                <p style="font-size: 14px; color: #6B7A94; line-height: 1.8; margin-bottom: 14px;">
                  Je vous contacterai dans les <strong style="color: #0A1628;">48h</strong> pour planifier votre session d'onboarding personnalisée (30 min avec moi).
                </p>
                <p style="font-size: 14px; color: #6B7A94; line-height: 1.8; margin-bottom: 24px;">
                  En attendant, vous pouvez créer votre compte et faire votre premier audit :
                </p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/signup" style="display: block; text-align: center; background: #4EC9B0; color: #fff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 10px;">
                  Créer mon compte →
                </a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/audit" style="display: block; text-align: center; background: transparent; color: #0A1628; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; border: 2px solid #0A1628;">
                  Faire mon audit gratuit
                </a>
              `}
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #F3F4F6;">
                <p style="font-size: 13px; color: #374151; margin: 0;">À très vite,</p>
                <p style="font-size: 13px; font-weight: 700; color: #0A1628; margin: 4px 0 2px;">Rélia Ebiya — Fondatrice Nexalie</p>
                <p style="font-size: 12px; color: #9CA3AF; margin: 0;">relia.ebiya@gmail.com · nexalie.co</p>
              </div>
            </div>
          </div>
        </body></html>
      `,
    });
  } catch (err) {
    console.error('Beta confirm email failed:', err.message);
  }

  // 2. Notification à Rélia
  try {
    await resend.emails.send({
      from: 'Nexalie Notifications <noreply@nexalie.co>',
      to: RELIA_EMAIL,
      subject: `[BETA] Nouvelle inscription — ${nom} · ${entreprise || email}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h3 style="color: #4EC9B0;">Nouveau bêta-testeur ${isWaitlist ? '(liste d\'attente)' : ''}</h3>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Entreprise :</strong> ${entreprise || '—'}</p>
          <p><strong>Places restantes après inscription :</strong> ${Math.max(0, (remaining || 0) - 1)}/${TOTAL_SPOTS}</p>
          <p style="color: #6B7A94; font-size: 12px;">nexalie.co · ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
    });
  } catch {}

  return Response.json({ success: true });
}
