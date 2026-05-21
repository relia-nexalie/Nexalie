import { createClient } from '@/lib/supabase/server';
import BetaForm from './BetaForm';

export const metadata = {
  title: 'Nexalie Beta — Programme Accès Anticipé',
  description: 'Rejoignez les 20 premières entreprises à tester Nexalie en avant-première. Accès gratuit 3 mois, influence directe sur le produit.',
};

const NAVY  = '#0A1628';
const TEAL  = '#4EC9B0';

async function getBetaCount() {
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'prospect')
      .eq('pack', 'beta');
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function BetaPage() {
  const taken = await getBetaCount();
  const remaining = Math.max(0, 20 - taken);

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: NAVY, minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: NAVY, padding: 'clamp(60px,8vw,100px) 24px', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: `${TEAL}20`, border: `1px solid ${TEAL}40`, color: TEAL, fontSize: '11px', fontWeight: 700, letterSpacing: '2px', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px', textTransform: 'uppercase' }}>
            Programme Beta · Places limitées
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,5vw,52px)', fontWeight: 300, lineHeight: 1.2, marginBottom: '20px' }}>
            Accès anticipé Nexalie
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', lineHeight: 1.7, marginBottom: '36px' }}>
            Rejoignez les 20 premières entreprises à tester Nexalie en avant-première. 3 mois d'accès Pro gratuit. Votre feedback façonne le produit.
          </p>

          {/* Compteur */}
          <div style={{ display: 'inline-flex', gap: '32px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px 36px', marginBottom: '36px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '42px', fontWeight: 800, color: TEAL, lineHeight: 1 }}>{remaining}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>places restantes</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '42px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{taken}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>bêta-testeurs</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '42px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>3</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>mois offerts</p>
            </div>
          </div>

          <div>
            <a href="#formulaire" style={{ background: TEAL, color: '#fff', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '16px', display: 'inline-block' }}>
              {remaining > 0 ? 'Rejoindre le programme →' : 'S\'inscrire sur liste d\'attente →'}
            </a>
          </div>
        </div>
      </section>

      {/* CE QUE VOUS OBTENEZ */}
      <section style={{ padding: 'clamp(48px,6vw,80px) 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 300, textAlign: 'center', marginBottom: '48px' }}>
            Ce que vous obtenez
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))', gap: '20px' }}>
            {[
              { icon: '🚀', title: 'Accès Pro 3 mois offerts', desc: 'Roadmap IA, Nexalie OS illimité, PDF, certifications — tout débloquer.' },
              { icon: '🎯', title: 'Influence directe', desc: 'Vos retours sont priorisés. Vous participez aux décisions produit.' },
              { icon: '📞', title: 'Session individuelle', desc: 'Un appel 1:1 avec Rélia (fondatrice) pour configurer votre espace.' },
              { icon: '💰', title: '50% de réduction à vie', desc: 'Si vous continuez après la beta, tarif préférentiel garanti à vie.' },
              { icon: '🏅', title: 'Badge Early Adopter', desc: 'Mention "Bêta-testeur Nexalie" + accès prioritaire aux futures fonctionnalités.' },
              { icon: '📊', title: 'Rapport personnalisé', desc: 'Analyse approfondie de votre maturité digitale réalisée par l\'équipe.' },
            ].map((item) => (
              <div key={item.title} style={{ background: '#F8FAFC', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{item.icon}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: NAVY }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#6B7A94', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFIL RECHERCHÉ */}
      <section style={{ background: '#F8FAFC', padding: 'clamp(40px,5vw,64px) 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,3vw,30px)', fontWeight: 300, textAlign: 'center', marginBottom: '32px' }}>
            Profil recherché
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'PME française ou africaine avec 2 à 200 collaborateurs',
              'Direction ou manager en charge de la transformation digitale',
              'Prêt à tester activement la plateforme pendant 3 mois',
              'Disponible pour 2 appels de feedback (30 min chacun)',
              'Pas besoin d\'être expert tech — c\'est fait pour les non-techniciens',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 18px', background: '#fff', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                <span style={{ color: TEAL, fontWeight: 700, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: '14px', color: NAVY, lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section id="formulaire" style={{ padding: 'clamp(48px,6vw,80px) 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 300, textAlign: 'center', marginBottom: '8px' }}>
            {remaining > 0 ? 'Réserver ma place' : 'Rejoindre la liste d\'attente'}
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7A94', fontSize: '14px', marginBottom: '32px' }}>
            {remaining > 0
              ? `${remaining} place${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''} sur 20`
              : 'Toutes les places sont prises. Inscrivez-vous pour être notifié en priorité.'}
          </p>
          <BetaForm remaining={remaining} />
        </div>
      </section>
    </div>
  );
}

