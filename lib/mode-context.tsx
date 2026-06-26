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

  // Applique les CSS variables — direction unique vert profond + or
  useEffect(() => {
    const root = document.documentElement;
    // Même palette pour les deux modes — identité unique
    root.style.setProperty('--nx-bg',             '#0f2e24');
    root.style.setProperty('--nx-bg2',            '#1a3d2e');
    root.style.setProperty('--nx-accent',         '#c9a24b');
    root.style.setProperty('--nx-accent-action',  '#d4900c');
    root.style.setProperty('--nx-text',           '#f5f0e8');
    root.style.setProperty('--nx-text-muted',     'rgba(245,240,232,.58)');
    root.style.setProperty('--nx-section-bg',     '#f5f0e8');
    root.style.setProperty('--nx-section-text',   '#0f2e24');
    // Compatibilité audit existant
    root.style.setProperty('--nx-navy',           '#0f2e24');
    root.style.setProperty('--nx-gold',           '#c9a24b');
    root.style.setProperty('--nx-green',          '#1a3d2e');
    root.style.setProperty('--nx-text-primary',   '#0f2e24');
    root.style.setProperty('--nx-text-secondary', '#4B5563');
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
