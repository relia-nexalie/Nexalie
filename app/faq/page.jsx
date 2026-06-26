'use client';

import { useState } from 'react';
import Link from 'next/link';

const BG   = 'var(--nx-bg)';
const TEXT = 'var(--nx-text)';
const MUTED = 'rgba(245,240,232,.55)';
const ACCENT = 'var(--nx-accent)';
const CREAM  = 'var(--nx-section-bg)';
const DARK   = 'var(--nx-section-text)';
const BORDER = 'rgba(0,0,0,0.07)';

const FAQS = [
  {
    q: "C'est quoi exactement Nexalie ?",
    a: "Nexalie est un outil de diagnostic numérique pensé pour les PME africaines. En 20 questions, il évalue où en est votre entreprise sur les axes qui comptent vraiment : présence en ligne, relation client, gestion interne, outils numériques. Vous repartez avec un score clair et un plan d'action concret. Pendant la bêta, c'est entièrement gratuit, avec un accompagnement humain inclus.",
  },
  {
    q: "Le diagnostic est vraiment gratuit ?",
    a: "Oui, totalement gratuit, sans carte bancaire, sans inscription obligatoire. Pendant la phase bêta, l'accès est ouvert à un nombre de places limité. Vous obtenez votre score, vos 3 priorités et votre plan d'action daté. Et si vous avez une question après, on est joignables sur WhatsApp.",
  },
  {
    q: "Combien de temps ça prend ?",
    a: "Entre 15 et 20 minutes. Les questions sont simples et directes, sans jargon technique. Elles sont pensées pour fonctionner sur mobile, même avec une connexion lente. Vous pouvez reprendre là où vous en étiez si votre connexion coupe.",
  },
  {
    q: "Nexalie peut-il m'aider si je suis débutant en numérique ?",
    a: "C'est précisément pour vous que Nexalie existe. La plupart de nos utilisateurs partent d'un niveau bas : c'est normal, c'est le point de départ. Le diagnostic identifie les 3 premières choses à faire, dans le bon ordre, avec des outils accessibles depuis votre téléphone.",
  },
  {
    q: "Mes données sont-elles confidentielles ?",
    a: "Oui, absolument. Vos réponses restent strictement privées. Si votre diagnostic fait partie des données agrégées transmises à des institutions partenaires, c'est toujours de façon anonymisée, sans aucune information permettant de vous identifier. Vous avez le droit de le refuser.",
  },
  {
    q: "Est-ce que je reçois un vrai accompagnement humain ?",
    a: "Oui. Pendant la bêta, chaque diagnostic est suivi d'un contact humain via WhatsApp. Relia ou un membre de l'équipe répond sous 24h. Pas un bot, pas une FAQ : une vraie personne qui a lu votre rapport et peut vous aider à prioriser.",
  },
  {
    q: "Est-ce que le rapport est sauvegardé ?",
    a: "Votre rapport est disponible immédiatement après le diagnostic. Vous pouvez le télécharger en PDF pour le consulter hors connexion ou le partager via WhatsApp. Créez un compte pour retrouver votre historique et suivre votre progression audit après audit.",
  },
  {
    q: "Pour qui est fait Nexalie ?",
    a: "Pour tout dirigeant ou responsable d'une TPE ou PME en Afrique francophone : commerçants, prestataires de services, artisans, entrepreneurs du BTP, de l'agri-business, des médias... Si vous gérez une activité et que vous voulez avancer dans le numérique sans vous perdre, Nexalie est fait pour vous.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ background: CREAM, fontFamily: 'var(--font-jakarta, sans-serif)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: BG, padding: 'clamp(48px,7vw,80px) 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', letterSpacing: '3px', color: 'rgba(201,162,75,.6)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Aide &amp; Support
          </p>
          <h1 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(28px,4.5vw,44px)', fontWeight: 300, color: TEXT, marginBottom: '12px', lineHeight: 1.2 }}>
            Vous avez une question ?<br />
            <em style={{ color: ACCENT, fontStyle: 'italic' }}>On a les réponses.</em>
          </h1>
          <p style={{ fontSize: '15px', color: MUTED, lineHeight: 1.7 }}>
            Et si votre question n&apos;est pas là, écrivez-nous sur WhatsApp. Réponse sous 24h.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(40px,5vw,64px) 24px' }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', padding: '22px 0', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
            >
              <span style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '16px', fontWeight: 400, color: open === i ? DARK : DARK, lineHeight: 1.4 }}>
                {faq.q}
              </span>
              <span style={{ fontSize: '22px', color: ACCENT, flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>
                +
              </span>
            </button>
            {open === i && (
              <div style={{ paddingBottom: '24px', animation: 'fadeIn 0.25s ease' }}>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.85 }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}

        {/* CTA contact */}
        <div style={{ marginTop: '56px', padding: '36px', background: BG, borderRadius: '16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '22px', fontWeight: 300, color: TEXT, marginBottom: '10px' }}>
            Votre question n&apos;est pas là ?
          </p>
          <p style={{ fontSize: '14px', color: MUTED, marginBottom: '24px', lineHeight: 1.7 }}>
            Relia répond personnellement sous 24h. Via WhatsApp, c&apos;est souvent beaucoup plus rapide.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/33786620409" target="_blank" rel="noreferrer"
              style={{ padding: '13px 28px', background: '#25D366', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
              💬 Écrire sur WhatsApp
            </a>
            <Link href="/contact"
              style={{ padding: '13px 24px', background: 'transparent', border: '1px solid rgba(245,240,232,.2)', borderRadius: '8px', color: 'rgba(245,240,232,.65)', fontSize: '14px', textDecoration: 'none' }}>
              Formulaire de contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
