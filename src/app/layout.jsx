import { Josefin_Sans, Playfair_Display } from 'next/font/google'

const josefin_sans = Josefin_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-josefin_sans',
  display: 'swap',
  adjustFontFallback: false,
})

const playfair_display = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair_display',
  display: 'swap',
  adjustFontFallback: false,
})


import "./globals.css";
import "@styles/css/plugins/bootstrap.min.css";
import "@styles/css/plugins/swiper.min.css";
import "@styles/css/plugins/font-awesome.min.css";
import { register } from "swiper/element/bundle";
// register Swiper custom elements
register();

import '@styles/scss/style.scss';

import AppData from "@data/app.json";
import StructuredData from "@components/StructuredData";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

  title: {
    default: `${AppData.settings.siteName} – Самуил (обл. Разград)`,
    template: `%s | ${AppData.settings.siteName}`,
  },

  // Keep description natural; avoid stuffing
  description:
    AppData.settings.siteDescription,

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

  icons: {
    icon: [
      '/favicon.ico',
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',

  other: {
    'msapplication-TileColor': '#d4af37',
    'msapplication-config': '/browserconfig.xml',
  },
}

const Layouts = ({ children }) => {
  return (
    <html lang="bg" className={`${josefin_sans.variable} ${playfair_display.variable}`}>
      <body
        style={{ backgroundImage: `url(${AppData.settings.bgImage})` }}
        suppressHydrationWarning
      >
        {/* Structured data (JSON-LD). This can be safely included in the body. */}
        <StructuredData />

        <div className="tst-main-overlay"></div>

        {/* app wrapper */}
        <div id="tst-app" className="tst-app">
          {children}
        </div>
        {/* app wrapper end */}

        {/* Vercel Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

export default Layouts
