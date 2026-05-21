import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  return {
    title: `Vérification certificat — Nexalie`,
    description: 'Vérifiez l\'authenticité d\'un certificat Nexalie Digital Ready.',
  };
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export default async function VerifyPage({ params }) {
  const { code } = params;
  const supabase = getServiceClient();

  const { data: cert } = await supabase
    .from('certifications')
    .select(`
      *,
      profiles:user_id (
        organisation,
        secteur,
        email
      )
    `)
    .eq('public_code', code)
    .single();

  const now = new Date();
  const isExpired = cert?.valid_until && new Date(cert.valid_until) < now;
  const isValid = cert && !isExpired;

  const issuedDate = cert?.issued_at
    ? new Date(cert.issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const validDate = cert?.valid_until
    ? new Date(cert.valid_until).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const orgName = cert?.profiles?.organisation || cert?.profiles?.email?.split('@')[0] || 'Organisation';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '48px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 300, color: '#0A1628' }}>Nexalie</span>
        <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: '#4EC9B0' }}>AI</span>
      </Link>

      <div style={{ width: '100%', maxWidth: '520px' }}>

        {!cert ? (
          /* Code invalide */
          <div style={{ background: '#fff', border: '2px solid #FEE2E2', borderRadius: '16px', padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '20px' }}>❌</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 300, color: '#0A1628', marginBottom: '12px' }}>
              Certificat introuvable
            </h1>
            <p style={{ fontSize: '15px', color: '#6B7A94', lineHeight: 1.7, marginBottom: '8px' }}>
              Le code <code style={{ background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', fontSize: '13px', color: '#374151' }}>{code}</code> ne correspond à aucun certificat Nexalie.
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '28px' }}>
              Vérifiez que le lien est complet et n'a pas été modifié.
            </p>
            <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#0A1628', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
              Retour à Nexalie
            </Link>
          </div>

        ) : isExpired ? (
          /* Certificat expiré */
          <div style={{ background: '#fff', border: '2px solid #FDE68A', borderRadius: '16px', padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '20px' }}>⏰</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 300, color: '#0A1628', marginBottom: '12px' }}>
              Certificat expiré
            </h1>
            <p style={{ fontSize: '15px', color: '#6B7A94', lineHeight: 1.7, marginBottom: '8px' }}>
              Le certificat de <strong>{orgName}</strong> était valide jusqu'au <strong>{validDate}</strong>.
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '28px' }}>
              Ce certificat n'est plus en vigueur. L'organisation peut en obtenir un nouveau sur nexalie.co.
            </p>
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', color: '#92400E' }}>
              Score au moment de la certification : <strong>{cert.score}/100</strong>
            </div>
          </div>

        ) : (
          /* Certificat valide */
          <>
            {/* Badge de validation */}
            <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '36px', height: '36px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>✓</span>
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#065F46', fontSize: '14px', margin: 0 }}>Certificat authentique et valide</p>
                <p style={{ fontSize: '12px', color: '#059669', margin: 0 }}>Émis par Nexalie · nexalie.co</p>
              </div>
            </div>

            {/* Certificat */}
            <div style={{ background: '#fff', border: '2.5px solid #C9A84C', borderRadius: '16px', padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #C9A84C, #4EC9B0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>
                ✓
              </div>

              <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '10px' }}>
                Certifie que
              </p>

              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,32px)', fontWeight: 400, color: '#0A1628', marginBottom: '6px' }}>
                {orgName}
              </h2>

              {cert.profiles?.secteur && (
                <p style={{ fontSize: '14px', color: '#6B7A94', marginBottom: '20px' }}>{cert.profiles.secteur}</p>
              )}

              <div style={{ display: 'inline-block', background: 'rgba(78,201,176,0.1)', border: '2px solid #4EC9B0', borderRadius: '12px', padding: '14px 28px', marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', color: '#4EC9B0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                  Score de maturité digitale
                </p>
                <p style={{ fontSize: '44px', fontWeight: 900, color: '#4EC9B0', lineHeight: 1 }}>
                  {cert.score}<span style={{ fontSize: '18px', color: '#9CA3AF', fontWeight: 400 }}>/100</span>
                </p>
              </div>

              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 400, color: '#0A1628', marginBottom: '16px' }}>
                est <span style={{ color: '#C9A84C', fontWeight: 700 }}>Nexalie Digital Ready</span>
              </h3>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Délivré le</p>
                  <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{issuedDate}</p>
                </div>
                <div style={{ width: '1px', background: '#E5E7EB' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Valide jusqu'au</p>
                  <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{validDate}</p>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px 16px', display: 'inline-block' }}>
                <p style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '2px' }}>Code de vérification</p>
                <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#374151', fontWeight: 700 }}>{code}</p>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', fontStyle: 'italic' }}>
                  Nexalie — Intelligence Artificielle pour PME · nexalie.co
                </p>
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: '20px' }}>
              Ce certificat a été délivré sur <Link href="/" style={{ color: '#4EC9B0', textDecoration: 'none' }}>nexalie.co</Link> après évaluation de la maturité digitale de l'organisation.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
