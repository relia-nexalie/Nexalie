'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
export type Mode = 'fr' | 'af';

interface ModeContextType {
  mode: Mode;
  setMode: (m: Mode) => void;
  isAfrica: boolean;
}

const ModeContext = createContext<ModeContextType>({
  mode: 'fr',
  setMode: () => {},
  isAfrica: false,
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('nexali-mode') as Mode;
    if (saved === 'fr' || saved === 'af') setModeState(saved);
  }, []);

  // Applique les CSS variables et la palette selon le mode
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'af') {
      root.style.setProperty('--nx-bg', '#FFFFFF');
      root.style.setProperty('--nx-section-bg', '#FFF8F4');
      root.style.setProperty('--nx-navy', '#1A0800');
      root.style.setProperty('--nx-accent', '#E88C32');
      root.style.setProperty('--nx-accent-dark', '#A85520');
      root.style.setProperty('--nx-gold', '#F5C842');
      root.style.setProperty('--nx-green', '#2D6A4F');
      root.style.setProperty('--nx-text-primary', '#1A0800');
      root.style.setProperty('--nx-text-secondary', '#7A6B62');
    } else {
      root.style.setProperty('--nx-bg', '#FFFFFF');
      root.style.setProperty('--nx-section-bg', '#F8FAFC');
      root.style.setProperty('--nx-navy', '#0A1628');
      root.style.setProperty('--nx-accent', '#4EC9B0');
      root.style.setProperty('--nx-accent-dark', '#1D6B60');
      root.style.setProperty('--nx-gold', '#C9A84C');
      root.style.setProperty('--nx-green', '#2E9B8B');
      root.style.setProperty('--nx-text-primary', '#0A1628');
      root.style.setProperty('--nx-text-secondary', '#6B7A94');
    }
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem('nexali-mode', m);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, isAfrica: mode === 'af' }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
