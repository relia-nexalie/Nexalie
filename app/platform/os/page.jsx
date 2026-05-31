import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NexaliPlatform from '@/components/NexaliPlatform';

export const metadata = { title: 'Nexalie OS — Assistant IA' };

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

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <NexaliPlatform
        userId={user.id}
        userPlan={plan}
        userMode={profile?.mode || 'af'}
        userMarket={profile?.market || 'af'}
        userSecteur={profile?.secteur}
        userPays={profile?.pays}
      />
    </div>
  );
}
