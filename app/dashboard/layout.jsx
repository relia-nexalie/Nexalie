import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'Dashboard Rélia — Nexalie Admin' };

const NAV = [
  { href: '/dashboard',            label: 'Vue globale',  icon: '📊' },
  { href: '/dashboard/clients',    label: 'Clients',      icon: '👥' },
  { href: '/dashboard/audits',     label: 'Audits',       icon: '📋' },
  { href: '/dashboard/knowledge',  label: 'Mémoire IA',   icon: '🧠' },
  { href: '/dashboard/sav',        label: 'SAV',          icon: '🐛' },
];

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'relia.ebiya@gmail.com') redirect('/');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', background: '#0A1628', color: '#fff',
        padding: '0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#C9A84C', letterSpacing: '-0.02em' }}>Nexalie</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin · Rélia</div>
        </div>

        <nav style={{ padding: '12px 0', flex: 1 }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 20px', color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/platform" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
            ← Retour plateforme
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: '#F8FAFC', overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
