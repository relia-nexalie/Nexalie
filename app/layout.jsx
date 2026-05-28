import Script from 'next/script';
import { Fraunces, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
import ClientProviders from '@/components/ClientProviders';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400', '600'],
  display: 'swap',
});

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
    default: 'Nexalie — Transformation Digitale IA · France & Afrique',
    template: '%s — Nexalie',
  },
  description: 'En 20 minutes, Nexalie analyse votre maturité digitale et génère votre plan d\'action IA. Gratuit. Adapté France et Afrique francophone.',
  keywords: ['transformation digitale', 'IA', 'Afrique francophone', 'France', 'audit digital', 'PME', 'OHADA', 'Mobile Money', 'roadmap digitale', 'consulting IA'],
  authors: [{ name: 'Rélia Ebiya', url: 'https://nexalie-ecqc.vercel.app' }],
  creator: 'Nexalie',
  publisher: 'Nexalie',
  openGraph: {
    title: 'Nexalie — Transformation Digitale IA · France & Afrique',
    description: 'Audit gratuit 3 min · Roadmap IA · Badge Digital Ready. Pour PME françaises et africaines.',
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

      <body className={`${fraunces.variable} ${jakarta.variable} ${mono.variable}`} style={{ margin: 0, padding: 0 }}>
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
