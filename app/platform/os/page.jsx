import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NexaliPlatform from '@/components/NexaliPlatform';

export const metadata = { title: 'Nexalie OS — Assistant IA' };

const MSG_LIMIT_FREE = 5;
const PLANS_UNLIMITED = ['pro', 'institutions'];

export default async function NexaliOSPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/platform/os');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, mode, market, secteur, pays')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan || 'free';
  const isAdmin = user.email === 'relia.ebiya@gmail.com';
  const isUnlimited = isAdmin || PLANS_UNLIMITED.includes(plan);

  // Compter les messages du jour pour les comptes gratuits
  let todayCount = 0;
  if (!isUnlimited) {
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('os_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    todayCount = count || 0;
  }

  const limitReached = !isUnlimited && todayCount >= MSG_LIMIT_FREE;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Bannière limite si plan gratuit */}
      {!isUnlimited && (
        <div style={{
          background: todayCount >= MSG_LIMIT_FREE ? '#FEF2F2' : '#FFFBEB',
          borderBottom: `1px solid ${todayCount >= MSG_LIMIT_FREE ? '#FECACA' : '#FDE68A'}`,
          padding: '10px 20px', textAlign: 'center', fontSize: '13px',
          color: todayCount >= MSG_LIMIT_FREE ? '#991B1B' : '#92400E',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        }}>
          <span>
            {limitReached
              ? `Limite atteinte — ${MSG_LIMIT_FREE} messages/jour sur le plan gratuit.`
              : `${MSG_LIMIT_FREE - todayCount} message${MSG_LIMIT_FREE - todayCount > 1 ? 's' : ''} restant${MSG_LIMIT_FREE - todayCount > 1 ? 's' : ''} aujourd'hui.`}
          </span>
          <a
            href="/pricing"
            style={{
              background: '#F59E0B', color: '#fff', padding: '4px 14px',
              borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontSize: '12px',
            }}
          >
            Passer Pro
          </a>
        </div>
      )}

      <NexaliPlatform
        userId={user.id}
        userPlan={plan}
        userMode={profile?.mode || 'fr'}
        userMarket={profile?.market || 'fr'}
        userSecteur={profile?.secteur}
        userPays={profile?.pays}
        isUnlimited={isUnlimited}
        limitReached={limitReached}
        todayCount={todayCount}
        msgLimit={MSG_LIMIT_FREE}
      />
    </div>
  );
}
