import Script from 'next/script';
import { Plus_Jakarta_Sans, DM_Mono, Bricolage_Grotesque } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ClientProviders from '@/components/ClientProviders';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600'],
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
  metadataBase: new URL('https://nexalie.co'),
  title: {
    default: 'Nexalie · La boussole numérique des entrepreneurs africains',
    template: '%s · Nexalie',
  },
  description: 'En 15 minutes depuis votre téléphone, Nexalie évalue votre entreprise et vous donne un plan clair. Diagnostic gratuit, accompagnement humain inclus.',
  keywords: ['maturité numérique PME Congo', 'comment digitaliser mon entreprise Congo', 'diagnostic numérique entreprise Afrique', 'digitalisation PME Brazzaville', 'par où commencer pour digitaliser ma PME', 'transformation digitale Afrique', 'PME africaines'],
  authors: [{ name: 'Rélia Ebiya', url: 'https://nexalie.co' }],
  creator: 'Nexalie',
  publisher: 'Nexalie',
  openGraph: {
    title: 'Nexalie · La boussole numérique des entrepreneurs africains',
    description: 'Vous savez où vous voulez aller. On vous montre par où commencer. Diagnostic gratuit, 15 minutes, depuis votre téléphone.',
    url: 'https://nexalie.co',
    siteName: 'Nexalie',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Nexalie · Boussole numérique des PME africaines' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexalie · Boussole numérique des PME africaines',
    description: 'Diagnostic gratuit · Plan d\'action daté · Accompagnement humain',
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

      <body className={`${display.variable} ${jakarta.variable} ${mono.variable}`} style={{ margin: 0, padding: 0 }}>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
