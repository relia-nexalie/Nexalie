'use client';

import { useLang, LANG_LABELS, Lang } from '@/lib/lang-context';

const LANGS: Lang[] = ['fr', 'ln', 'ktu'];

export default function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '5px 11px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: lang === l ? 700 : 400,
            background: lang === l ? 'var(--accent, #C8A96B)' : 'transparent',
            color: '#fff',
            transition: 'background-color 0.35s ease, font-weight 0.2s',
            whiteSpace: 'nowrap',
            letterSpacing: lang === l ? '0.02em' : '0',
          }}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
