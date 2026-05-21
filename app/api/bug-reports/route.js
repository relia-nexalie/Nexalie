/**
 * SAV — Signalement de bugs
 *
 * SQL à exécuter dans Supabase (une seule fois) :
 *
 * create table bug_reports (
 *   id            uuid primary key default gen_random_uuid(),
 *   user_id       uuid references auth.users(id) on delete set null,
 *   page          text,
 *   description   text not null,
 *   screenshot_url text,
 *   status        text not null default 'nouveau',
 *   created_at    timestamptz not null default now()
 * );
 * alter table bug_reports enable row level security;
 * create policy "insert_own" on bug_reports for insert with check (true);
 * create policy "select_own" on bug_reports for select using (auth.uid() = user_id);
 */

import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// POST — Créer un signalement
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Corps invalide' }, { status: 400 });
  }

  const { page, description, screenshot_url } = body;
  if (!description?.trim()) {
    return Response.json({ error: 'Description requise' }, { status: 400 });
  }

  // Récupérer l'utilisateur si connecté (optionnel)
  let userId = null;
  let userEmail = null;
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) { userId = user.id; userEmail = user.email; }
  } catch {}

  const supabase = serviceClient();

  const { data: report, error } = await supabase
    .from('bug_reports')
    .insert({
      user_id: userId,
      page: page || '/',
      description: description.trim(),
      screenshot_url: screenshot_url || null,
      status: 'nouveau',
    })
    .select()
    .single();

  if (error) {
    console.error('bug_reports insert error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Email à Rélia
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Nexalie SAV <noreply@nexalie.co>',
      to: 'relia.ebiya@gmail.com',
      subject: `🐛 Nouveau signalement — ${page || '/'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px;">
          <div style="background: #0A1628; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px;">
            <h1 style="color: #4EC9B0; font-size: 18px; margin: 0 0 4px;">🐛 Nouveau signalement SAV</h1>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">Nexalie Platform</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 8px 0; color: #6B7A94; font-size: 13px; width: 120px;">Page</td>
                <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #0A1628;">${page || '/'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7A94; font-size: 13px;">Utilisateur</td>
                <td style="padding: 8px 0; font-size: 13px; color: #0A1628;">${userEmail || 'Non connecté'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7A94; font-size: 13px;">Référence</td>
                <td style="padding: 8px 0; font-size: 11px; color: #9CA3AF; font-family: monospace;">${report.id}</td></tr>
          </table>

          <div style="background: #F8FAFC; border-left: 3px solid #4EC9B0; border-radius: 4px; padding: 16px 20px; margin-bottom: 24px;">
            <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0;">${description.trim().replace(/\n/g, '<br>')}</p>
          </div>

          ${screenshot_url ? `<p style="font-size: 13px; color: #6B7A94;">Capture : <a href="${screenshot_url}" style="color: #4EC9B0;">${screenshot_url}</a></p>` : ''}

          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nexalie.co'}/dashboard/sav"
             style="display: inline-block; background: #0A1628; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px;">
            Voir dans le dashboard →
          </a>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('SAV email error:', emailErr.message);
    // Ne pas bloquer — le signalement est sauvegardé
  }

  return Response.json({ success: true, id: report.id });
}

// GET — Lister tous les signalements (admin uniquement)
export async function GET(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'relia.ebiya@gmail.com') {
    return Response.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const service = serviceClient();
  const { data, error } = await service
    .from('bug_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ reports: data });
}

// PATCH — Mettre à jour le statut (admin uniquement)
export async function PATCH(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'relia.ebiya@gmail.com') {
    return Response.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { id, status } = await request.json();
  if (!id || !status) return Response.json({ error: 'id et status requis' }, { status: 400 });

  const service = serviceClient();
  const { error } = await service
    .from('bug_reports')
    .update({ status })
    .eq('id', id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
