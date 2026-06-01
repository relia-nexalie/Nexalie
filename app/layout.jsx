import Script from 'next/script';
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
import ClientProviders from '@/components/ClientProviders';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://nexalie-ecqc.vercel.app'),
  title: {
    default: 'Nexalie — La boussole numérique des PME africaines',
    template: '%s — Nexalie',
  },
  description: 'Nexalie accompagne les PME africaines dans leur transformation numérique : diagnostic de maturité digitale, feuille de route personnalisée, outils concrets. Gratuit.',
  keywords: ['transformation digitale', 'IA', 'Afrique', 'Congo', 'audit digital', 'PME africaines', 'OHADA', 'Mobile Money', 'roadmap digitale', 'maturité numérique'],
  authors: [{ name: 'Rélia Ebiya', url: 'https://nexalie-ecqc.vercel.app' }],
  creator: 'Nexalie',
  publisher: 'Nexalie',
  openGraph: {
    title: 'Nexalie — La boussole numérique des PME africaines',
    description: 'Diagnostic de maturité digitale gratuit · Feuille de route personnalisée · Outils concrets pour PME africaines.',
    url: 'https://nexalie-ecqc.vercel.app',
    siteName: 'Nexalie',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Nexalie — Transformation Digitale IA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexalie — Transformation Digitale IA',
    description: 'Audit gratuit · Roadmap IA · Badge Digital Ready',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>

        {/* Meta Pixel — chargé uniquement si la variable est définie */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}</Script>
        )}
      </head>

      <body className={`${jakarta.variable} ${mono.variable}`} style={{ margin: 0, padding: 0 }}>
        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}

        {/* ClientProviders enveloppe tout le contenu avec WhatsApp + Exit Popup */}
        <ClientProviders>
          <GlobalHeader />
          {children}
          <GlobalFooter />
        </ClientProviders>
      </body>
    </html>
  );
}
