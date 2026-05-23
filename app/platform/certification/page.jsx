import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CertificationClient from './CertificationClient';

export const metadata = { title: 'Certification Nexalie Digital Ready' };

const PLANS_ALLOWED = ['pro', 'institutions'];
const SCORE_MINIMUM = 70;

export default async function CertificationPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/platform/certification');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, mode, organisation, secteur')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan || 'free';
  const isAdmin = user.email === 'relia.ebiya@gmail.com';

  if (!isAdmin && !PLANS_ALLOWED.includes(plan)) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#F8FAFC', textAlign: 'center',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>🏅</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 300, color: '#0A1628', marginBottom: '12px' }}>
          Badge Nexalie Digital Ready
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7A94', maxWidth: '480px', lineHeight: 1.7, marginBottom: '32px' }}>
          Obtenez votre certificat de maturité digitale et un QR code vérifiable.
          Disponible à partir du plan <strong>Pro</strong>.
        </p>
        <a href="/pricing" style={{ display: 'inline-block', padding: '14px 40px', background: '#4EC9B0', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
          Passer au plan Pro →
        </a>
        <a href="/platform" style={{ fontSize: '13px', color: '#6B7A94', textDecoration: 'none' }}>← Retour à la plateforme</a>
      </div>
    );
  }

  // Meilleur audit de l'utilisateur
  const { data: bestAudit } = await supabase
    .from('audits')
    .select('score, niveau, created_at, secteur')
    .eq('user_id', user.id)
    .order('score', { ascending: false })
    .limit(1)
    .single();

  const score = bestAudit?.score || 0;
  const eligible = score >= SCORE_MINIMUM;

  // Certification existante
  const { data: cert } = await supabase
    .from('certifications')
    .select('*')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })
    .limit(1)
    .single();

  // Génération d'un nouveau certificat si éligible et pas encore émis
  let certification = cert;
  if (eligible && !cert) {
    const publicCode = `NX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    const { data: newCert } = await supabase
      .from('certifications')
      .insert({
        user_id: user.id,
        score,
        valid_until: validUntil.toISOString(),
        public_code: publicCode,
      })
      .select()
      .single();
    certification = newCert;
  }

  return (
    <CertificationClient
      score={score}
      eligible={eligible}
      scoreMin={SCORE_MINIMUM}
      certification={certification}
      userEmail={user.email}
      organisation={profile?.organisation}
      secteur={bestAudit?.secteur || profile?.secteur}
      userMode={profile?.mode || 'fr'}
    />
  );
}
