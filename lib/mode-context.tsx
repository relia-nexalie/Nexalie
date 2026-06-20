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
  // Nexalie est désormais 100 % africaine : 'af' par défaut
  const [mode, setModeState] = useState<Mode>('af');

  useEffect(() => {
    const saved = localStorage.getItem('nexali-mode') as Mode;
    if (saved === 'fr' || saved === 'af') setModeState(saved);
    // Si aucune préférence sauvegardée, on force 'af'
    else localStorage.setItem('nexali-mode', 'af');
  }, []);

  // Applique les CSS variables et la palette selon le mode
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'af') {
      root.style.setProperty('--nx-bg', '#FFFFFF');
      root.style.setProperty('--nx-section-bg', '#F8F6F1');
      root.style.setProperty('--nx-navy', '#0F172A');
      root.style.setProperty('--nx-accent', '#C8A96B');
      root.style.setProperty('--nx-accent-dark', '#9A7A2A');
      root.style.setProperty('--nx-gold', '#C8A96B');
      root.style.setProperty('--nx-green', '#1F5F4A');
      root.style.setProperty('--nx-text-primary', '#0F172A');
      root.style.setProperty('--nx-text-secondary', '#4B5563');
    } else {
      root.style.setProperty('--nx-bg', '#FFFFFF');
      root.style.setProperty('--nx-section-bg', '#F8FAFC');
      root.style.setProperty('--nx-navy', '#0F172A');
      root.style.setProperty('--nx-accent', '#4EC9B0');
      root.style.setProperty('--nx-accent-dark', '#1D6B60');
      root.style.setProperty('--nx-gold', '#C8A96B');
      root.style.setProperty('--nx-green', '#2E9B8B');
      root.style.setProperty('--nx-text-primary', '#0F172A');
      root.style.setProperty('--nx-text-secondary', '#4B5563');
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
