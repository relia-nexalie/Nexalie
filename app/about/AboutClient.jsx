'use client';

import Link from 'next/link';

export default function AboutClient() {
  const navy        = 'var(--nx-bg)';
  const accent      = 'var(--nx-accent)';
  const accentText  = 'var(--nx-accent)';

  return (
    <div style={{ fontFamily: 'var(--font-jakarta, system-ui, sans-serif)', background: 'var(--nx-section-bg)', color: 'var(--nx-section-text)' }}>

      {/* ── HERO — asymétrique ──────────────────────────────────────── */}
      <section style={{ background: navy, padding: 'clamp(56px,7vw,96px) 24px' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: 'clamp(32px,5vw,72px)', alignItems: 'center'
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '20px' }}>Notre raison d&apos;être</p>
            <blockquote style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: 'clamp(20px,2.8vw,30px)',
              fontWeight: 300, color: '#fff', lineHeight: 1.6,
              borderLeft: `3px solid ${accent}`, paddingLeft: '24px',
              marginBottom: '32px', fontStyle: 'italic'
            }}>
              &ldquo;Je suis née à Brazzaville, j&apos;ai grandi en France. Entre ces deux mondes, j&apos;ai vu une évidence : les PME africaines ont le talent et l&apos;énergie, mais pas les outils pensés pour leur réalité. Nexalie existe pour ça.&rdquo;
            </blockquote>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
              Fondatrice de Nexalie
            </p>
          </div>

          {/* Monogramme — remplace la photo pour préserver la discrétion */}
          <div style={{
            width: '200px', height: '200px', borderRadius: '50%',
            flexShrink: 0,
            border: `2px solid ${accent}40`,
            background: `rgba(201,168,76,0.06)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 40px rgba(0,0,0,0.25), 0 0 0 8px rgba(201,168,76,0.06)`,
          }}>
            {/* Boussole stylisée */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="36" stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" />
              <circle cx="40" cy="40" r="3" fill={accent} />
              {/* Aiguille Nord */}
              <polygon points="40,10 37,40 43,40" fill={accent} fillOpacity="0.9" />
              {/* Aiguille Sud */}
              <polygon points="40,70 37,40 43,40" fill={accent} fillOpacity="0.35" />
              {/* Points cardinaux */}
              <text x="40" y="8" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace" fillOpacity="0.7">N</text>
              <text x="40" y="78" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace" fillOpacity="0.4">S</text>
              <text x="74" y="43" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace" fillOpacity="0.4">E</text>
              <text x="6" y="43" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace" fillOpacity="0.4">O</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ── MANIFESTE — 2 colonnes asymétriques ────────────────────── */}
      <section style={{ padding: 'clamp(64px,8vw,112px) 24px', background: 'var(--nx-section-bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'start' }}>

          {/* GAUCHE — Le Manifeste */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '3px', color: accentText, marginBottom: '24px', textTransform: 'uppercase' }}>Le Manifeste</p>
            <h2 style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: 'clamp(32px,4.5vw,52px)',
              fontWeight: 400, color: navy,
              lineHeight: 1.25, marginBottom: '36px'
            }}>
              Les PME africaines méritent les mêmes outils que les grands groupes. Sans en payer le prix.
            </h2>
            <div style={{ fontSize: '16px', color: '#374151', lineHeight: 2, borderLeft: `2px solid ${accent}50`, paddingLeft: '24px' }}>
              <p style={{ marginBottom: '20px' }}>
                J&apos;ai piloté la transformation numérique de grands groupes industriels. Je sais ce que ces outils coûtent, et je sais qu&apos;une PME de Brazzaville n&apos;en a pas besoin de la moitié. Nexalie, c&apos;est ce que j&apos;aurais voulu donner à mon oncle commerçant.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Puis j&apos;ai regardé vers Brazzaville, vers Kinshasa, vers Dakar. Les entrepreneurs que j&apos;y côtoie portent 95 % de l&apos;économie réelle de leur pays. Ils travaillent sans filet, sans outils adaptés, sans accès aux méthodologies qui leur permettraient de structurer leur croissance.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Ce n&apos;est pas un manque de talent. C&apos;est un manque d&apos;outils pensés pour leur réalité.
              </p>
              <p style={{ fontWeight: 600, color: navy }}>
                Nexalie existe pour combler cet écart : diagnostic en 5 minutes, feuille de route concrète, outils accessibles.
              </p>
              <p style={{ marginTop: '20px', color: '#374151' }}>
                L&apos;audit est gratuit pour les PME parce que nous croyons que l&apos;accès à l&apos;information ne devrait pas être un privilège. Ce modèle est rendu possible par les institutions, bailleurs et partenaires qui utilisent les données agrégées et anonymisées pour piloter leurs programmes de développement.
              </p>
            </div>
          </div>

          {/* DROITE — La Légitimité */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '3px', color: '#9CA3AF', marginBottom: '28px', textTransform: 'uppercase' }}>La légitimité</p>

            {[
              {
                label: 'ANCRAGE INDUSTRIEL',
                color: accentText,
                body: 'Plus de dix ans en gestion de projet et transformation digitale dans des environnements exigeants. Chaque outil, chaque méthode chez Nexalie vient du terrain. Pas de recette importée, pas de conseil déconnecté de la réalité locale.',
              },
              {
                label: 'DOUBLE CULTURE',
                color: accent,
                body: 'Paris et Brazzaville. Les deux mondes coexistent dans notre façon de penser. Nexalie comprend le Mobile Money, les réalités locales — et les exigences d\'un accompagnement structuré et rigoureux.',
              },
              {
                label: "L'AMBITION NEXALIE",
                color: 'var(--nx-accent)',
                body: "Bâtir l'infrastructure de confiance numérique de l'espace francophone. D'ici 2030, chaque PME africaine devrait avoir accès à un plan de transformation digitale concret — au même niveau de qualité qu'un grand cabinet, sans en payer le prix.",
              },
            ].map(({ label, color, body }) => (
              <div key={label} style={{
                padding: '28px 0',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px', letterSpacing: '3px',
                  color, marginBottom: '12px', textTransform: 'uppercase'
                }}>{label}</p>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.85 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARCOURS — masqué (trop personnel) ─────────────────────── */}
      {false && (
        <section style={{ background: navy, padding: 'clamp(56px,7vw,88px) 24px' }}>
          {/* Code conservé mais non affiché */}
        </section>
      )}

      {/* ── VISION ──────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px,7vw,88px) 24px', background: 'var(--nx-section-bg)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '3px', color: accentText, marginBottom: '12px', textTransform: 'uppercase' }}>Vision 2030</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px,4vw,46px)', fontWeight: 400, color: 'var(--nx-section-text)', marginBottom: '24px', lineHeight: 1.2 }}>
            La boussole numérique de l&apos;Afrique francophone
          </h2>
          <p style={{ fontSize: '17px', color: '#374151', lineHeight: 1.95, marginBottom: '40px' }}>
            D&apos;ici 2030, chaque PME africaine aura accès à un plan de transformation numérique concret — dans sa langue, adapté à son marché, à un coût qu&apos;elle peut justifier.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/audit" style={{ padding: '15px 32px', background: navy, borderRadius: '10px', color: 'var(--nx-text)', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Je fais mon diagnostic gratuit
            </Link>
            <Link href="/contact" style={{ padding: '15px 24px', background: 'transparent', border: '2px solid rgba(0,0,0,0.12)', borderRadius: '10px', color: '#4B5563', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
              Me contacter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
