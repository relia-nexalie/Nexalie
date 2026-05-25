import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data: cert } = await supabase
    .from('certifications')
    .select('*, profiles:user_id(organisation)')
    .eq('public_code', params.code)
    .single();

  const org = cert?.profiles?.organisation || 'Entreprise';
  return {
    title: `Certificat Nexalie Digital Ready — ${org}`,
    description: `${org} a obtenu la certification Nexalie Digital Ready avec un score de ${cert?.score ?? '—'}/100.`,
    openGraph: {
      title: `${org} est Nexalie Digital Ready`,
      description: `Score de maturité digitale : ${cert?.score ?? '—'}/100 — Certifié par Nexalie`,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  };
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

const NAVY = '#0A1628';
const TEAL = '#4EC9B0';
const GOLD = '#C9A84C';

export default async function CertPage({ params }) {
  const { code } = params;
  const supabase = getServiceClient();

  const { data: cert } = await supabase
    .from('certifications')
    .select(`
      *,
      profiles:user_id (
        organisation,
        secteur,
        full_name,
        country
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

  const orgName = cert?.profiles?.organisation || cert?.profiles?.full_name || 'Organisation';
  const secteur = cert?.profiles?.secteur || null;
  const country = cert?.profiles?.country || null;

  const verifyUrl = `https://nexalie-ecqc.vercel.app/verify/${code}`;
  const certUrl = `https://nexalie-ecqc.vercel.app/cert/${code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verifyUrl)}&bgcolor=ffffff&color=0A1628&margin=8`;

  const linkedinMsg = `Je suis fier(e) d'annoncer que ${orgName} vient d'obtenir la certification #NexalieDigitalReady avec un score de ${cert?.score ?? '—'}/100 ! 🚀 Notre transformation digitale avance. Vérifiez notre certificat : ${certUrl}`;
  const whatsappMsg = `✅ ${orgName} est maintenant certifiée *Nexalie Digital Ready* ! Score : ${cert?.score ?? '—'}/100 🎯 Voir le certificat : ${certUrl}`;

  if (!cert) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '40px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: NAVY }}>Nexalie</span>
          </Link>
          <div style={{ background: '#fff', border: '2px solid #FEE2E2', borderRadius: '16px', padding: '48px 32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 300, color: NAVY, marginBottom: '12px' }}>Certificat introuvable</h1>
            <p style={{ fontSize: '14px', color: '#6B7A94', lineHeight: 1.7 }}>
              Le code <code style={{ background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{code}</code> ne correspond à aucun certificat valide.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 300, color: NAVY }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: TEAL, marginLeft: '4px' }}>AI</span>
          </Link>
        </div>

        {/* Badge validité */}
        {isValid ? (
          <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
            <div style={{ width: '32px', height: '32px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: '16px' }}>✓</span>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#065F46', fontSize: '13px', margin: 0 }}>Certificat authentique et valide</p>
              <p style={{ fontSize: '11px', color: '#059669', margin: 0 }}>Vérifié sur nexalie.co · Émis par Nexalie</p>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FFFBEB', border: '2px solid #FDE68A', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
            <span style={{ fontSize: '24px' }}>⏰</span>
            <p style={{ fontWeight: 700, color: '#92400E', fontSize: '13px', margin: 0 }}>Certificat expiré le {validDate}</p>
          </div>
        )}

        {/* Certificat principal */}
        <div style={{ background: '#fff', border: `3px solid ${GOLD}`, borderRadius: '20px', padding: 'clamp(32px,5vw,56px)', textAlign: 'center', position: 'relative', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', maxWidth: '600px', margin: '0 auto 32px' }}>

          {/* Coin décoratif */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', border: `2px solid ${GOLD}`, borderRight: 'none', borderBottom: 'none', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', border: `2px solid ${GOLD}`, borderLeft: 'none', borderBottom: 'none', opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '40px', height: '40px', border: `2px solid ${GOLD}`, borderRight: 'none', borderTop: 'none', opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', border: `2px solid ${GOLD}`, borderLeft: 'none', borderTop: 'none', opacity: 0.5 }} />

          {/* Médaillon */}
          <div style={{ width: '72px', height: '72px', background: `linear-gradient(135deg, ${GOLD}, ${TEAL})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '30px' }}>
            ✓
          </div>

          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '16px' }}>
            Nexalie certifie que
          </p>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 400, color: NAVY, marginBottom: '8px', lineHeight: 1.2 }}>
            {orgName}
          </h1>

          {secteur && (
            <p style={{ fontSize: '14px', color: '#6B7A94', marginBottom: '8px' }}>{secteur}{country ? ` · ${country}` : ''}</p>
          )}

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 300, color: NAVY, marginBottom: '28px', letterSpacing: '-0.3px' }}>
            est <span style={{ color: GOLD, fontWeight: 700 }}>Nexalie Digital Ready</span>
          </h2>

          {/* Score */}
          <div style={{ display: 'inline-block', background: `${TEAL}12`, border: `2.5px solid ${TEAL}`, borderRadius: '16px', padding: '20px 40px', marginBottom: '28px' }}>
            <p style={{ fontSize: '11px', color: TEAL, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>Score de maturité digitale</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '52px', color: TEAL, lineHeight: 1, fontWeight: 400 }}>
              {cert.score}<span style={{ fontSize: '20px', color: '#9CA3AF', fontWeight: 300 }}>/100</span>
            </p>
          </div>

          {/* Dates */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Délivré le</p>
              <p style={{ fontSize: '14px', color: NAVY, fontWeight: 600 }}>{issuedDate}</p>
            </div>
            <div style={{ width: '1px', background: '#E5E7EB' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Valide jusqu'au</p>
              <p style={{ fontSize: '14px', color: NAVY, fontWeight: 600 }}>{validDate}</p>
            </div>
          </div>

          {/* Code de vérification */}
          <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px 20px', display: 'inline-block', marginBottom: '20px' }}>
            <p style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '2px' }}>Code de vérification</p>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', color: NAVY, fontWeight: 700, letterSpacing: '2px' }}>{code}</p>
          </div>

          {/* Signature */}
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px', marginTop: '8px' }}>
            <p style={{ fontSize: '12px', color: NAVY, fontWeight: 600, marginBottom: '2px' }}>Rélia Ebiya</p>
            <p style={{ fontSize: '11px', color: '#9CA3AF' }}>Fondatrice — Nexalie · nexalie.co</p>
          </div>
        </div>

        {/* QR Code + partage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start', maxWidth: '600px', margin: '0 auto 32px' }}>
          {/* QR */}
          <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '16px', textAlign: 'center', flexShrink: 0 }}>
            <img src={qrUrl} alt="QR Code vérification" width={120} height={120} style={{ display: 'block', marginBottom: '8px' }} />
            <p style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace' }}>Scanner pour vérifier</p>
          </div>

          {/* Partage */}
          <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Partager ce certificat</p>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#EFF6FF', borderRadius: '8px', textDecoration: 'none', marginBottom: '8px' }}
            >
              <span style={{ fontSize: '18px' }}>💼</span>
              <span style={{ fontSize: '13px', color: '#1D4ED8', fontWeight: 600 }}>Partager sur LinkedIn</span>
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#F0FDF4', borderRadius: '8px', textDecoration: 'none', marginBottom: '8px' }}
            >
              <span style={{ fontSize: '18px' }}>💬</span>
              <span style={{ fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>Partager sur WhatsApp</span>
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '18px' }}>🔗</span>
              <span style={{ fontSize: '11px', color: '#6B7A94', fontFamily: 'monospace', wordBreak: 'break-all' }}>{certUrl}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
            Vous souhaitez obtenir votre propre certification ?
          </p>
          <Link
            href="/audit"
            style={{ display: 'inline-block', background: NAVY, color: '#fff', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}
          >
            Faire mon audit gratuit →
          </Link>
        </div>

      </div>
    </div>
  );
}
