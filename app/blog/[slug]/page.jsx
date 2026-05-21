import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const NAVY = '#0A1628';
const TEAL = '#4EC9B0';
const TERRA = '#E88C32';

// Convertit le markdown basique en HTML sécurisé (sans dépendance externe)
function markdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|l|u])(.+)$/gm, (line) => line.trim() ? line : '')
    .replace(/<p><\/p>/g, '');
}

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data: article } = await supabase
    .from('blog')
    .select('titre, extrait, marche')
    .eq('slug', params.slug)
    .eq('publie', true)
    .single();

  if (!article) return { title: 'Article introuvable — Nexalie' };

  return {
    title: article.titre,
    description: article.extrait,
    alternates: { canonical: `https://nexalie.co/blog/${params.slug}` },
    openGraph: {
      title: article.titre,
      description: article.extrait,
      type: 'article',
      url: `https://nexalie.co/blog/${params.slug}`,
    },
  };
}

export default async function BlogSlugPage({ params }) {
  const supabase = createClient();

  // Article principal
  const { data: article } = await supabase
    .from('blog')
    .select('*')
    .eq('slug', params.slug)
    .eq('publie', true)
    .single();

  if (!article) notFound();

  const isAf = article.marche === 'af';
  const accent = isAf ? TERRA : TEAL;

  // Articles connexes (même marché ou les-deux, hors l'article courant)
  const { data: related } = await supabase
    .from('blog')
    .select('titre, slug, extrait, marche, created_at')
    .eq('publie', true)
    .neq('slug', params.slug)
    .or(`marche.eq.${article.marche},marche.eq.les-deux`)
    .order('created_at', { ascending: false })
    .limit(3);

  const htmlContent = markdownToHtml(article.contenu);
  const publishedDate = new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: NAVY, minHeight: '100vh', background: '#fff' }}>

      {/* HERO */}
      <section style={{ background: NAVY, padding: 'clamp(48px,6vw,80px) 24px 40px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Nexalie</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>›</span>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Blog</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{article.titre.slice(0, 40)}…</span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {article.marche !== 'les-deux' && (
              <span style={{ background: `${accent}25`, color: accent, fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {article.marche === 'fr' ? '🇫🇷 France' : '🌍 Afrique'}
              </span>
            )}
            {(article.tags || []).slice(0, 3).map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '4px 12px', borderRadius: '20px' }}>
                {tag}
              </span>
            ))}
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,4vw,40px)', fontWeight: 300, color: '#fff', lineHeight: 1.25, marginBottom: '16px' }}>
            {article.titre}
          </h1>

          {article.extrait && (
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '20px' }}>
              {article.extrait}
            </p>
          )}

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            Par <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Rélia Ebiya</strong> · Fondatrice Nexalie · {publishedDate}
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: 'clamp(32px,5vw,60px) 24px' }}>
        <div
          className="article-content"
          style={{ fontSize: '16px', lineHeight: 1.85, color: '#374151' }}
          dangerouslySetInnerHTML={{ __html: `<p>${htmlContent}</p>` }}
        />

      </section>

      {/* CTA AUDIT */}
      <section style={{ background: NAVY, margin: '0 24px clamp(32px,5vw,60px)', borderRadius: '20px', padding: 'clamp(32px,5vw,56px)', textAlign: 'center', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '12px' }}>Gratuit · 3 minutes</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,3.5vw,30px)', fontWeight: 300, color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>
          Évaluez votre maturité digitale maintenant
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
          Score sur 100 · 5 recommandations personnalisées · Rapport PDF gratuit
        </p>
        <Link
          href="/audit"
          style={{ background: accent, color: '#fff', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}
        >
          Faire mon audit gratuit →
        </Link>
      </section>

      {/* ARTICLES CONNEXES */}
      {related && related.length > 0 && (
        <section style={{ padding: 'clamp(32px,5vw,60px) 24px', borderTop: '1px solid #F3F4F6' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: NAVY, marginBottom: '24px' }}>Articles connexes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '20px' }}>
              {related.map(rel => {
                const relAccent = rel.marche === 'af' ? TERRA : TEAL;
                return (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#F8FAFC', borderRadius: '14px', padding: '22px', border: '1.5px solid rgba(0,0,0,0.06)', transition: 'border-color 0.2s' }}>
                    {rel.marche !== 'les-deux' && (
                      <p style={{ fontSize: '10px', fontWeight: 700, color: relAccent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        {rel.marche === 'fr' ? '🇫🇷 France' : '🌍 Afrique'}
                      </p>
                    )}
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: NAVY, lineHeight: 1.4, marginBottom: '8px' }}>{rel.titre}</h3>
                    {rel.extrait && <p style={{ fontSize: '12px', color: '#6B7A94', lineHeight: 1.6 }}>{rel.extrait.slice(0, 100)}…</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
