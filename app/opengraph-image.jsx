import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Nexalie · La boussole numérique des entrepreneurs africains';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0f2e24',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 88px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Cercles décoratifs */}
        <div
          style={{
            position: 'absolute',
            right: '-100px',
            top: '-100px',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            border: '1px solid rgba(201,162,75,0.10)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '60px',
            bottom: '40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(201,162,75,0.05)',
            display: 'flex',
          }}
        />

        {/* Ligne accent or */}
        <div
          style={{
            width: '56px',
            height: '3px',
            background: '#c9a24b',
            marginBottom: '28px',
            display: 'flex',
          }}
        />

        {/* Tag bêta */}
        <div
          style={{
            fontSize: '13px',
            color: '#c9a24b',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'flex',
            fontWeight: 400,
          }}
        >
          Diagnostic numerique gratuit · Beta
        </div>

        {/* Titre principal */}
        <div
          style={{
            fontSize: '50px',
            fontWeight: 300,
            color: '#f5f0e8',
            lineHeight: 1.15,
            marginBottom: '24px',
            maxWidth: '860px',
            display: 'flex',
          }}
        >
          Ou en est vraiment votre entreprise ?
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '21px',
            color: 'rgba(245,240,232,0.55)',
            maxWidth: '660px',
            lineHeight: 1.6,
            marginBottom: '52px',
            display: 'flex',
          }}
        >
          En 15 minutes, un score clair et un plan concret. Gratuit, depuis votre telephone.
        </div>

        {/* Logo Nexalie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.5px',
              display: 'flex',
            }}
          >
            Nexalie
          </div>
          <div
            style={{
              width: '1px',
              height: '22px',
              background: 'rgba(201,162,75,0.4)',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(201,162,75,0.7)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Boussole numerique
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
