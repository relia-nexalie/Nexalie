'use client';

import WhatsAppButton from './WhatsAppButton';
import ExitPopup from './ExitPopup';
import { ModeProvider } from '@/lib/mode-context';
import { LangProvider } from '@/lib/lang-context';

// Ce composant regroupe tous les éléments globaux client-side
// Importé dans app/layout.jsx (Server Component) via cette enveloppe client
export default function ClientProviders({ children }) {
  return (
    <ModeProvider>
      <LangProvider>
        {children}
        <WhatsAppButton />
        <ExitPopup />
      </LangProvider>
    </ModeProvider>
  );
}
