/**
 * MotifBackground — texture de fond Kongo
 *
 * Règles :
 *   - Toujours position:absolute derrière le contenu (z-index 0)
 *   - Le parent DOIT avoir position:relative
 *   - Le contenu frère DOIT avoir position:relative + z-index:1
 *   - Opacité 4-8% sur fond sombre, 6-10% sur fond ivoire
 *   - Un seul motif par section
 */
export default function MotifBackground({ name, size, opacity = 0.06 }) {
  // size : nombre (tuile carrée en px) | chaîne CSS ex. '48px 24px' | undefined → 'auto'
  const backgroundSize =
    typeof size === 'number' ? `${size}px` : (size ?? 'auto');

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url('/motifs/${name}.svg')`,
        backgroundRepeat: 'repeat',
        backgroundSize,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
