'use client';

import { useState } from 'react';
import { useMode } from '@/lib/mode-context';

// planKey doit correspondre aux clés dans les routes checkout
// ex: 'pro_monthly', 'pro_annual', 'starter_monthly'...
export default function CheckoutButton({ planKey, children, style = {} }) {
  const { isAfrica } = useMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accent = isAfrica ? '#E88C32' : '#4EC9B0';

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    const route = isAfrica
      ? '/api/cinetpay/checkout'
      : '/api/stripe/checkout';

    // Pour Stripe, le planKey suit la convention existante
    // Pour CinetPay, même convention planKey
    const body = isAfrica
      ? { planKey }
      : { planKey, market: 'fr' };

    try {
      const res = await fetch(route, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Une erreur est survenue.');
        setLoading(false);
        return;
      }

      // Redirection vers la page de paiement (Stripe ou CinetPay)
      window.location.href = data.url;
    } catch (err) {
      setError('Impossible de contacter le serveur.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          display: 'block',
          width: '100%',
          padding: '13px 16px',
          borderRadius: '10px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 700,
          fontSize: '14px',
          background: accent,
          color: '#fff',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s',
          ...style,
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            Chargement…
          </span>
        ) : children}
      </button>
      {error && (
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#EF4444', textAlign: 'center' }}>
          {error}
        </p>
      )}
      {/* Badge mode paiement */}
      <p style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginTop: '8px' }}>
        {isAfrica
          ? 'Orange Money · MTN MoMo · Wave · Moov'
          : 'Visa · Mastercard · Amex · Virement SEPA'}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
