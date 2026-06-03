'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fr, I18nKey } from '@/lib/i18n/fr';
import { ln } from '@/lib/i18n/ln';
import { ktu } from '@/lib/i18n/ktu';

export type Lang = 'fr' | 'ln' | 'ktu';

const TRANSLATIONS: Record<Lang, Partial<typeof fr>> = { fr, ln, ktu };

const LANG_LABELS: Record<Lang, string> = {
  fr:  'Français',
  ln:  'Lingala',
  ktu: 'Kituba',
};

export const LANG_ACCENTS: Record<Lang, string> = {
  fr:  '#C9A24B', // or
  ln:  '#1B7A4D', // vert vif
  ktu: '#C77B30', // ambre cuivré
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: I18nKey, vars?: Record<string, string | number>) => string;
  langLabel: string;
}

const LangContext = createContext<LangContextType>({
  lang: 'fr',
  setLang: () => {},
  t: (key) => fr[key] as string,
  langLabel: 'Français',
});

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('nexali-lang') as Lang;
    if (saved === 'fr' || saved === 'ln' || saved === 'ktu') {
      setLangState(saved);
      document.documentElement.style.setProperty('--accent', LANG_ACCENTS[saved]);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('nexali-lang', l);
    document.documentElement.style.setProperty('--accent', LANG_ACCENTS[l]);
  };

  const t = useCallback((key: I18nKey, vars?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[lang];
    // Repli sur le français si la clé manque dans la langue choisie
    const raw = (dict[key] ?? fr[key]) as string;
    return interpolate(raw, vars);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, langLabel: LANG_LABELS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export { LANG_LABELS };
