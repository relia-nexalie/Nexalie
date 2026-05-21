import { Resend } from 'resend';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const RELIA_EMAIL = 'relia.ebiya@gmail.com';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Corps invalide' }, { status: 400 });
  }

  const { nom, organisation, email, pays, message, source = 'marque-blanche' } = body;

  if (!nom || !email) {
    return Response.json({ error: 'Nom et email requis' }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Sauvegarder dans la table clients (best-effort)
  try {
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    await supabase.from('clients').insert({
      nom,
      entreprise: organisation || '',
      pays: pays || '',
      pack: source,
      status: 'prospect',
      notes: message || '',
    });
  } catch {}

  // 2. Email de notification à Rélia
  try {
    await resend.emails.send({
      from: 'Nexalie Notifications <noreply@nexalie.co>',
      to: RELIA_EMAIL,
      subject: `[${source.toUpperCase()}] Nouvelle demande — ${nom} (${organisation || email})`,
      html: `
        <!DOCTYPE html>
        <html><head><meta charset="utf-8" /></head>
        <body style="font-family: sans-serif; padding: 20px; color: #0A1628;">
          <h2 style="color: #4EC9B0;">Nouvelle demande de contact — ${source}</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            ${[
              ['Nom', nom],
              ['Organisation', organisation || '—'],
              ['Email', email],
              ['Pays', pays || '—'],
              ['Source', source],
            ].map(([k, v]) => `
              <tr>
                <td style="padding: 8px 12px; background: #F8FAFC; font-weight: 700; width: 130px; border: 1px solid #E5E7EB;">${k}</td>
                <td style="padding: 8px 12px; border: 1px solid #E5E7EB;">${v}</td>
              </tr>
            `).join('')}
            ${message ? `
              <tr>
                <td style="padding: 8px 12px; background: #F8FAFC; font-weight: 700; border: 1px solid #E5E7EB; vertical-align: top;">Message</td>
                <td style="padding: 8px 12px; border: 1px solid #E5E7EB;">${message}</td>
              </tr>
            ` : ''}
          </table>
          <p style="margin-top: 20px; font-size: 13px; color: #6B7A94;">Reçu le ${new Date().toLocaleString('fr-FR')} · nexalie.co</p>
        </body></html>
      `,
    });
  } catch (err) {
    console.error('Contact email to Rélia failed:', err.message);
  }

  // 3. Email de confirmation au prospect
  try {
    await resend.emails.send({
      from: 'Rélia — Nexalie <relia@nexalie.co>',
      to: email,
      subject: 'Votre demande Nexalie — je vous réponds sous 24h',
      html: `
        <!DOCTYPE html>
        <html><head><meta charset="utf-8" /></head>
        <body style="font-family: -apple-system, sans-serif; background: #F8FAFC;">
          <div style="max-width: 540px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden;">
            <div style="background: #0A1628; padding: 24px 36px;">
              <span style="color: #fff; font-size: 20px; font-style: italic;">Nexalie</span>
              <span style="color: #4EC9B0; font-family: monospace; font-size: 9px; letter-spacing: 2px; margin-left: 4px;">AI</span>
            </div>
            <div style="padding: 32px 36px;">
              <h2 style="font-size: 20px; font-weight: 300; color: #0A1628; margin-bottom: 14px;">
                Bonjour ${nom},
              </h2>
              <p style="font-size: 14px; color: #6B7A94; line-height: 1.8; margin-bottom: 14px;">
                J'ai bien reçu votre demande concernant la solution marque blanche Nexalie. Je reviens vers vous <strong style="color: #0A1628;">sous 24h ouvrées</strong> pour un appel de découverte.
              </p>
              <p style="font-size: 14px; color: #6B7A94; line-height: 1.8; margin-bottom: 24px;">
                En attendant, vous pouvez tester la plateforme en conditions réelles sur <a href="https://nexalie.co" style="color: #4EC9B0; text-decoration: none;">nexalie.co</a> — l'audit digital est gratuit et sans inscription.
              </p>
              <a href="https://nexalie.co/audit" style="display: inline-block; background: #4EC9B0; color: #fff; padding: 13px 26px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Tester l'audit gratuit →
              </a>
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #F3F4F6;">
                <p style="font-size: 13px; color: #374151; margin: 0;">À très vite,</p>
                <p style="font-size: 13px; font-weight: 700; color: #0A1628; margin: 4px 0 0;">Rélia Ebiya — Fondatrice Nexalie</p>
              </div>
            </div>
          </div>
        </body></html>
      `,
    });
  } catch {}

  return Response.json({ success: true });
}
