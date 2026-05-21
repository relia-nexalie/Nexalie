import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import KnowledgeManager from '@/components/KnowledgeManager';

export const metadata = { title: 'Mémoire IA — Nexalie Admin' };

export default async function KnowledgePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'relia.ebiya@gmail.com') redirect('/');

  const { data: items } = await supabase
    .from('knowledge')
    .select('*')
    .order('priorite', { ascending: true });

  return <KnowledgeManager initialItems={items || []} />;
}
