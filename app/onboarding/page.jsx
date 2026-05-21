import OnboardingFlow from '@/components/OnboardingFlow';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Bienvenue sur Nexalie !' };

export default async function OnboardingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, full_name, market')
    .eq('id', user.id)
    .single();

  // Si déjà fait → plateforme directement
  if (profile?.onboarding_completed) redirect('/platform');

  return (
    <OnboardingFlow
      userName={profile?.full_name || user.email}
      initialMode={profile?.market || 'fr'}
    />
  );
}
