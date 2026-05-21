'use client';

import { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
      {tooltip && (
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '220px', animation: 'fadeIn 0.2s ease' }}>
          <p style={{ fontSize: '13px', color: '#0A1628', fontWeight: 600, marginBottom: '2px' }}>Besoin d'aide ?</p>
          <p style={{ fontSize: '12px', color: '#6B7A94' }}>Relia répond sous 24h</p>
        </div>
      )}
      <a
        href="https://wa.me/33786620409?text=Bonjour%2C%20j%27ai%20une%20question%20sur%20Nexalie."
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: '#25D366', borderRadius: '50%', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', textDecoration: 'none', transition: 'transform 0.2s', fontSize: '24px' }}
        aria-label="Contacter Nexalie sur WhatsApp"
      >
        💬
      </a>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
