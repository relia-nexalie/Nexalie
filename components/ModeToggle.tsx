'use client';
import { useMode } from '@/lib/mode-context';

export default function ModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useMode();
  return (
    <div className={className} style={{ display:'flex', background:'rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'8px', overflow:'hidden', flexShrink:0 }}>
      {([['fr','🇫🇷 France'],['af','🌍 Afrique']] as const).map(([m, label]) => (
        <button key={m} onClick={() => setMode(m)}
          style={{
            padding:'7px 14px', border:'none', cursor:'pointer',
            fontSize:'13px', fontWeight: mode === m ? 700 : 400,
            background: mode === m ? 'var(--nx-accent, #2E9B8B)' : 'transparent',
            color: mode === m ? '#fff' : 'var(--nx-text-secondary, #6B7A94)',
            transition:'all 0.2s',
          }}>{label}</button>
      ))}
    </div>
  );
}
