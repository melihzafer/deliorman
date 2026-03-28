import { Josefin_Sans, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'

const josefin_sans = Josefin_Sans({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-josefin_sans',
  display: 'swap',
  adjustFontFallback: true,
})

const playfair_display = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-playfair_display',
  display: 'swap',
  adjustFontFallback: true,
})


import "./globals.css";
import "@styles/css/plugins/bootstrap.min.css";
import "@styles/css/plugins/swiper.min.css";
import "@styles/css/plugins/font-awesome.min.css";
// (moved Swiper custom element registration to a client-only component)

import '@styles/scss/style.scss';

import AppData from "@data/app.json";
import StructuredData from "@components/StructuredData";
import ClientBoot from "@components/ClientBoot";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@library/CartContext";
import LazyLayoutWidgets from "@components/common/LazyLayoutWidgets";
import MobileBottomNav from "@components/common/MobileBottomNav";
import OrderSummary from "@components/order/OrderSummary";

// IMPORTANT: This must match the real canonical domain used in production.
// Google uses it to resolve icon/manifest URLs.
const siteUrl = 'https://restorantdeliorman.com';

/** @type {import('next').Metadata} */
export const metadata = {
  metadataBase: new URL(siteUrl),

  // Canonical + language alternates
  alternates: {
    canonical: '/',
    languages: {
      bg: '/',
    },
  },

  // Strengthen PWA/app signals
  applicationName: AppData.settings.siteName,
  generator: 'Next.js',

  title: {
    default: `${AppData.settings.siteName} – Самуил (обл. Разград)`,
    template: `%s | ${AppData.settings.siteName}`,
  },

  // Keep description natural; avoid stuffing
  description: AppData.settings.siteDescription,

  // Keywords are not a major Google ranking factor; keep them short & relevant.
  keywords: [
    'ресторант Делиорман',
    'ресторант Самуил',
    'ресторант Разград',
    'българска кухня',
    'традиционна храна',
    'обедно меню',
    'резервации',
    'ресторант с градина',
  ],

  authors: [{ name: 'Ресторант Делиорман' }],
  creator: 'Ресторант Делиорман',
  publisher: 'Ресторант Делиорман',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: siteUrl,
    title: `${AppData.settings.siteName} – Самуил (обл. Разград)`,
    description: AppData.settings.siteDescription,
    siteName: AppData.settings.siteName,
    images: [
      {
        // Use the built-in Next.js OG image route (always exists)
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: AppData.settings.siteName,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${AppData.settings.siteName} – Самуил (обл. Разград)`,
    description: AppData.settings.siteDescription,
    images: ['/opengraph-image'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Keep icons in sync with /public and webmanifest
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  // Ensures browsers & crawlers can resolve manifest-relative icons from the canonical domain
  manifest: '/site.webmanifest',

  // PWA hints (not required for SEO, but helps installability/branding)
  appleWebApp: {
    title: AppData.settings.siteName,
    capable: true,
    statusBarStyle: 'default',
  },

  // Optional: if you add Search Console / other verification tokens, put them here.
  // verification: {
  //   google: 'YOUR_TOKEN_HERE',
  // },

  other: {
    'msapplication-TileColor': '#F39C12',
    'msapplication-config': '/browserconfig.xml',
  },
}

// Next.js 16 expects themeColor under viewport.
/** @type {import('next').Viewport} */
export const viewport = {
  themeColor: '#F39C12',
}

const Layouts = async ({ children }) => {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations('common');

  return (
    <html
      lang={locale}
      className={`${josefin_sans.variable} ${playfair_display.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="preconnect" href="https://events.mapbox.com" />
        {/* DNS prefetch for analytics (loaded conditionally in production) */}
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body
        style={{
          backgroundImage: `url(${AppData.settings.bgImage})`,
        }}
        suppressHydrationWarning
      >
        {/* Skip to main content link for keyboard/screen reader users */}
        <a href="#main-content" className="tst-skip-link">
          {t('skipToContent')}
        </a>

        {/* Structured data (JSON-LD). This can be safely included in the body. */}
        <StructuredData />

        {/* Client-only bootstrapping (e.g., web components) */}
        <ClientBoot />

        <div className="tst-main-overlay"></div>

        {/* app wrapper */}
        <div id="tst-app" className="tst-app">
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* Lazy-loaded non-critical UI widgets (scroll progress, back-to-top, feedback) */}
            <LazyLayoutWidgets />
            <CartProvider>
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <OrderSummary />
            </CartProvider>
            <MobileBottomNav />
          </NextIntlClientProvider>
        </div>
        {/* app wrapper end */}

        {/* Vercel Analytics */}
        {process.env.NODE_ENV === 'production' ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  )
}

export default Layouts
