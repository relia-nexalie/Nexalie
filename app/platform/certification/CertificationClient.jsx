'use client';

import { useMode } from '@/lib/mode-context';
import { QRCodeSVG } from 'qrcode.react';

export default function CertificationClient({ score, eligible, scoreMin, certification, userEmail, organisation, secteur, userMode }) {
  const { isAfrica } = useMode();
  const accent = isAfrica ? '#E88C32' : '#4EC9B0';
  const navy = isAfrica ? '#1A0800' : '#0A1628';
  const gold = isAfrica ? '#F5C842' : '#C9A84C';

  const orgName = organisation || userEmail?.split('@')[0] || 'Votre organisation';
  const issuedDate = certification?.issued_at ? new Date(certification.issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
  const validDate = certification?.valid_until ? new Date(certification.valid_until).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const qrUrl = certification?.public_code
    ? `https://nexalie.co/verify/${certification.public_code}`
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ background: navy, padding: '48px 24px 40px', color: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '12px' }}>Certification</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,42px)', fontWeight: 300, marginBottom: '10px' }}>
          Badge Nexalie Digital Ready
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
          Votre niveau de maturité digitale, certifié et vérifiable.
        </p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

        {!eligible ? (
          /* Pas encore éligible */
          <div style={{ background: '#fff', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', border: '2px solid rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎯</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 300, color: navy, marginBottom: '12px' }}>
              Score actuel : {score}/100
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7A94', lineHeight: 1.7, marginBottom: '8px' }}>
              Il vous faut <strong>{scoreMin - score} points supplémentaires</strong> pour obtenir votre badge.
            </p>
            <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '32px' }}>
              Score minimum requis : <strong>{scoreMin}/100</strong>
            </p>

            {/* Barre de progression vers le badge */}
            <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '8px', height: '12px', marginBottom: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${score}%`, height: '100%', background: accent, borderRadius: '8px', transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF', marginBottom: '32px' }}>
              <span>0</span>
              <span style={{ color: accent, fontWeight: 700 }}>Seuil : {scoreMin}</span>
              <span>100</span>
            </div>

            <a href="/audit" style={{ display: 'inline-block', padding: '14px 40px', background: accent, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
              Améliorer mon score →
            </a>
          </div>
        ) : (
          /* Éligible — Affichage certificat */
          <>
            {/* Certificat */}
            <div
              id="certificate"
              style={{
                background: '#fff',
                border: `3px solid ${gold}`,
                borderRadius: '20px',
                padding: '48px 40px',
                textAlign: 'center',
                marginBottom: '28px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Watermark */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-20deg)', fontSize: '120px', opacity: 0.03, pointerEvents: 'none', fontFamily: 'Georgia, serif' }}>
                Nexalie
              </div>

              {/* Badge */}
              <div style={{ width: '80px', height: '80px', background: `linear-gradient(135deg, ${gold}, ${accent})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>
                ✓
              </div>

              <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '12px' }}>
                Certifie que
              </p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 400, color: navy, marginBottom: '6px' }}>
                {orgName}
              </h2>
              {secteur && (
                <p style={{ fontSize: '14px', color: '#6B7A94', marginBottom: '24px' }}>{secteur}</p>
              )}

              <div style={{ display: 'inline-block', background: `${accent}15`, border: `2px solid ${accent}`, borderRadius: '12px', padding: '16px 32px', marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', color: accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Score de maturité digitale</p>
                <p style={{ fontSize: '48px', fontWeight: 900, color: accent, lineHeight: 1 }}>{score}<span style={{ fontSize: '20px', color: '#9CA3AF' }}>/100</span></p>
              </div>

              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 400, color: navy, marginBottom: '8px' }}>
                est <span style={{ color: gold, fontWeight: 700 }}>Nexalie Digital Ready</span>
              </h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '28px' }}>
                Délivré le {issuedDate} · Valide jusqu'au {validDate}
              </p>

              {/* QR Code réel */}
              {certification?.public_code && (
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: '#F8FAFC', borderRadius: '12px', padding: '16px 20px' }}>
                  <QRCodeSVG
                    value={`https://nexalie.co/verify/${certification.public_code}`}
                    size={80}
                    bgColor="#F8FAFC"
                    fgColor={navy}
                    level="M"
                  />
                  <p style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {certification.public_code}
                  </p>
                  <p style={{ fontSize: '10px', color: '#9CA3AF' }}>Scannez pour vérifier</p>
                </div>
              )}

              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Nexalie — Intelligence Artificielle pour PME · nexalie.co
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => window.print()}
                style={{ padding: '12px 28px', background: accent, color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}
              >
                Imprimer le certificat
              </button>
              {qrUrl && (
                <button
                  onClick={() => { navigator.clipboard.writeText(qrUrl); alert('Lien de vérification copié !'); }}
                  style={{ padding: '12px 28px', background: 'transparent', color: navy, borderRadius: '10px', border: `2px solid ${navy}`, cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}
                >
                  Copier le lien de vérification
                </button>
              )}
            </div>

            {/* Partage LinkedIn */}
            <div style={{ marginTop: '24px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#1D4ED8', marginBottom: '12px' }}>
                💼 Partagez votre badge sur LinkedIn
              </p>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(qrUrl || 'https://nexalie.co')}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-block', padding: '10px 24px', background: '#0A66C2', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}
              >
                Partager sur LinkedIn →
              </a>
            </div>
          </>
        )}
      </div>

      <style suppressHydrationWarning>{`
        @media print {
          body > *:not(#certificate) { display: none; }
          #certificate { border: 3px solid #C9A84C !important; }
        }
      `}</style>
    </div>
  );
}
