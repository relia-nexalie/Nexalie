import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// Note pour le développeur :
// Ce fichier utilise @react-pdf/renderer côté serveur.
// Installer : npm install @react-pdf/renderer
// La génération PDF tourne dans un Node.js runtime (pas edge).

export const runtime = 'nodejs';

export async function POST(request) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const { auditId } = await request.json();

  if (!auditId) {
    return Response.json({ error: 'auditId requis' }, { status: 400 });
  }

  // Récupérer l'audit
  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .eq('user_id', session.user.id)
    .single();

  if (auditError || !audit) {
    return Response.json({ error: 'Audit introuvable' }, { status: 404 });
  }

  // Récupérer le profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation, secteur, plan')
    .eq('id', session.user.id)
    .single();

  try {
    // Import dynamique pour éviter les erreurs si non installé
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { AuditPDFDocument } = await import('@/lib/pdf/AuditPDFDocument');

    const pdfBuffer = await renderToBuffer(
      AuditPDFDocument({
        audit,
        profile,
        userEmail: session.user.email,
        generatedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      })
    );

    // Upload dans Supabase Storage
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const fileName = `${session.user.id}/${auditId}.pdf`;

    const { error: uploadError } = await serviceClient.storage
      .from('reports')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw new Error(uploadError.message);

    // URL signée valide 24h
    const { data: signedUrl } = await serviceClient.storage
      .from('reports')
      .createSignedUrl(fileName, 86400);

    // Mettre à jour l'audit avec l'URL du rapport
    await supabase.from('audits').update({
      rapport_pdf_url: signedUrl?.signedUrl,
    }).eq('id', auditId);

    // Envoyer l'email avec le rapport
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: request.headers.get('cookie') || '' },
      body: JSON.stringify({
        type: 'report_generated',
        reportData: {
          toolName: audit.mode === 'af' ? 'Bilan Numérique' : 'Audit de Maturité Digitale',
          score: audit.score,
          level: audit.niveau,
          pdfUrl: signedUrl?.signedUrl,
        },
      }),
    }).catch(() => {});

    return Response.json({
      success: true,
      url: signedUrl?.signedUrl,
    });

  } catch (err) {
    // Si @react-pdf/renderer pas encore installé, retourner une erreur claire
    if (err.code === 'MODULE_NOT_FOUND') {
      return Response.json({
        error: 'PDF non disponible — installer @react-pdf/renderer',
        install: 'npm install @react-pdf/renderer',
      }, { status: 503 });
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}
