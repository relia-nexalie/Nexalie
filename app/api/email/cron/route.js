import { createClient as createServiceClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const BATCH_LIMIT = 50;

// Mapping sequence → type d'email POST /api/email
const SEQUENCE_TO_TYPE = {
  j1_post_audit:         'j1_post_audit',
  reminder_audit:        'reminder_audit',
  discover_roadmap:      'discover_roadmap',
  upgrade_prompt:        'upgrade_prompt',
  monthly_progress_pro:  'monthly_progress_pro',
  weekly_action:         'weekly_action',
  rapport_mensuel:       'rapport_mensuel',
};

export async function GET(request) {
  // Vérification du secret Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const resend = new Resend(process.env.RESEND_API_KEY);

  const now = new Date().toISOString();

  // 1. Récupérer les emails planifiés en attente
  const { data: pending, error: fetchError } = await supabase
    .from('email_sequences')
    .select('id, user_id, sequence, step')
    .lte('scheduled_at', now)
    .is('sent_at', null)
    .order('scheduled_at', { ascending: true })
    .limit(BATCH_LIMIT);

  if (fetchError) {
    console.error('Cron fetch error:', fetchError.message);
    return Response.json({ error: fetchError.message }, { status: 500 });
  }

  if (!pending || pending.length === 0) {
    return Response.json({ sent: 0, message: 'Aucun email en attente' });
  }

  // 2. Traiter chaque email en attente
  let sent = 0;
  let failed = 0;

  for (const row of pending) {
    try {
      // Récupérer l'utilisateur
      const { data: userRes } = await supabase.auth.admin.getUserById(row.user_id);
      const user = userRes?.user;
      if (!user?.email) { failed++; continue; }

      // Récupérer le profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('mode, plan, audit_score, audit_level, full_name')
        .eq('id', row.user_id)
        .single();

      const isAf = profile?.mode === 'af';
      const name = profile?.full_name || user.email.split('@')[0];
      const emailType = SEQUENCE_TO_TYPE[row.sequence] || row.sequence;

      // Construire les données selon le type
      let reportData = {};
      if (emailType === 'j1_post_audit') {
        reportData = { score: profile?.audit_score ?? 0, niveau: profile?.audit_level ?? 'intermediaire' };
      } else if (emailType === 'monthly_progress_pro') {
        const { data: audits } = await supabase
          .from('audits')
          .select('score, created_at')
          .eq('user_id', row.user_id)
          .order('created_at', { ascending: false })
          .limit(6);
        reportData = { audits: audits || [] };
      } else if (emailType === 'discover_roadmap') {
        reportData = { score: profile?.audit_score };
      } else if (emailType === 'weekly_action') {
        // Récupérer la prochaine action de roadmap
        const { data: roadmap } = await supabase
          .from('reports')
          .select('content')
          .eq('user_id', row.user_id)
          .eq('type', 'roadmap')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
          .catch(() => ({ data: null }));
        let nextAction = null;
        if (roadmap?.content) {
          try {
            const parsed = typeof roadmap.content === 'string' ? JSON.parse(roadmap.content) : roadmap.content;
            nextAction = parsed?.phases?.[0]?.actions?.[0] ?? null;
          } catch {}
        }
        const { data: profileFull } = await supabase
          .from('profiles')
          .select('secteur')
          .eq('id', row.user_id)
          .single();
        reportData = {
          score: profile?.audit_score ?? 0,
          nextAction,
          secteur: profileFull?.secteur ?? '',
        };
      } else if (emailType === 'rapport_mensuel') {
        // Rapport mensuel enrichi
        const { data: audits } = await supabase
          .from('audits')
          .select('score, created_at, recommandations')
          .eq('user_id', row.user_id)
          .order('created_at', { ascending: false })
          .limit(2);
        const currentScore = audits?.[0]?.score ?? profile?.audit_score ?? 0;
        const previousScore = audits?.[1]?.score ?? 0;
        const { data: profileFull } = await supabase
          .from('profiles')
          .select('secteur, plan')
          .eq('id', row.user_id)
          .single();
        const { data: bench } = await supabase
          .from('benchmarks')
          .select('score_moyen')
          .eq('secteur', profileFull?.secteur ?? 'general')
          .single()
          .catch(() => ({ data: null }));
        // Actions depuis recommandations
        let nextActions = [];
        try {
          const rec = audits?.[0]?.recommandations;
          if (typeof rec === 'string') nextActions = rec.split('\n').filter(l => l.trim()).slice(0, 3);
          else if (Array.isArray(rec)) nextActions = rec.slice(0, 3);
        } catch {}
        reportData = {
          currentScore,
          previousScore,
          nextActions,
          topActions: [],
          benchmarkScore: bench?.score_moyen ?? null,
          secteur: profileFull?.secteur ?? '',
          plan: profileFull?.plan ?? 'free',
        };
      }

      // Appeler la route email interne
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexalie.co';
      const emailRes = await fetch(`${baseUrl}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: emailType, userId: row.user_id, reportData }),
      });

      if (emailRes.ok) {
        // Marquer comme envoyé
        await supabase
          .from('email_sequences')
          .update({ sent_at: new Date().toISOString() })
          .eq('id', row.id);
        sent++;
      } else {
        failed++;
      }
    } catch (err) {
      console.error(`Cron email failed for seq ${row.id}:`, err.message);
      failed++;
    }
  }

  // 3. Planifier les séquences automatiques (nouveaux utilisateurs, etc.)
  await scheduleAutoSequences(supabase);

  return Response.json({ sent, failed, total: pending.length });
}

async function scheduleAutoSequences(supabase) {
  const now = new Date();

  // J+3 reminder_audit — utilisateurs sans audit créés il y a 3+ jours
  const j3 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const { data: noAuditUsers } = await supabase
    .from('profiles')
    .select('id')
    .is('audit_score', null)
    .lt('created_at', j3)
    .limit(100);

  for (const user of noAuditUsers || []) {
    const { count } = await supabase
      .from('email_sequences')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('sequence', 'reminder_audit');

    if (!count || count === 0) {
      await supabase.from('email_sequences').insert({
        user_id: user.id,
        sequence: 'reminder_audit',
        step: 1,
        scheduled_at: now.toISOString(),
      }).catch(() => {});
    }
  }

  // J+7 discover_roadmap — utilisateurs avec audit, plan free, créés il y a 7+ jours
  const j7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: freeUsers } = await supabase
    .from('profiles')
    .select('id')
    .eq('plan', 'free')
    .not('audit_score', 'is', null)
    .lt('created_at', j7)
    .limit(100);

  for (const user of freeUsers || []) {
    const { count } = await supabase
      .from('email_sequences')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('sequence', 'discover_roadmap');

    if (!count || count === 0) {
      await supabase.from('email_sequences').insert({
        user_id: user.id,
        sequence: 'discover_roadmap',
        step: 1,
        scheduled_at: now.toISOString(),
      }).catch(() => {});
    }
  }

  // Mensuel progress — users Pro actifs
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { data: proUsers } = await supabase
    .from('profiles')
    .select('id')
    .in('plan', ['pro', 'institutions'])
    .limit(200);

  for (const user of proUsers || []) {
    const { count } = await supabase
      .from('email_sequences')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('sequence', 'monthly_progress_pro')
      .gte('created_at', firstOfMonth);

    if (!count || count === 0) {
      await supabase.from('email_sequences').insert({
        user_id: user.id,
        sequence: 'monthly_progress_pro',
        step: 1,
        scheduled_at: now.toISOString(),
      }).catch(() => {});
    }
  }

  // ─── RAPPORT MENSUEL pour TOUS les utilisateurs actifs (1er du mois) ───
  const isFirstOfMonth = now.getDate() === 1;
  if (isFirstOfMonth) {
    const { data: allActiveUsers } = await supabase
      .from('profiles')
      .select('id')
      .not('audit_score', 'is', null)
      .limit(500);

    for (const user of allActiveUsers || []) {
      const { count } = await supabase
        .from('email_sequences')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('sequence', 'rapport_mensuel')
        .gte('created_at', firstOfMonth);

      if (!count || count === 0) {
        await supabase.from('email_sequences').insert({
          user_id: user.id,
          sequence: 'rapport_mensuel',
          step: 1,
          scheduled_at: now.toISOString(),
        }).catch(() => {});
      }
    }
  }

  // ─── ALERTES HEBDOMADAIRES chaque lundi 8h — users Pro avec roadmap ───
  const dayOfWeek = now.getDay(); // 1 = lundi
  const hourOfDay = now.getHours();
  const isMonday8h = dayOfWeek === 1 && hourOfDay >= 7 && hourOfDay <= 10;

  if (isMonday8h) {
    // Prochain lundi 8h pour planifier
    const nextMonday = new Date(now);
    const daysUntilMonday = (8 - nextMonday.getDay()) % 7 || 7;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    nextMonday.setHours(8, 0, 0, 0);

    const { data: proRoadmapUsers } = await supabase
      .from('profiles')
      .select('id')
      .in('plan', ['pro', 'institutions'])
      .not('audit_score', 'is', null)
      .limit(300);

    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);

    for (const user of proRoadmapUsers || []) {
      const { count } = await supabase
        .from('email_sequences')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('sequence', 'weekly_action')
        .gte('created_at', weekStart.toISOString());

      if (!count || count === 0) {
        // Envoyer maintenant + planifier le prochain
        await supabase.from('email_sequences').insert({
          user_id: user.id,
          sequence: 'weekly_action',
          step: 1,
          scheduled_at: now.toISOString(),
        }).catch(() => {});
      }
    }
  }
}
