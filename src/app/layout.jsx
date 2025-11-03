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

const siteUrl = 'https://deliorman.com'; // TODO: Update with your actual domain

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: AppData.settings.siteName,
    template: "%s | " + AppData.settings.siteName,
  },
  description: AppData.settings.siteDescription,
  keywords: [
    'ресторант Делиорман',
    'българска кухня',
    'традиционна храна',
    'ресторант България',
    'Лудогорие',
    'български специалитети',
    'ресторант меню',
    'традиционен ресторант',
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
    title: AppData.settings.siteName,
    description: AppData.settings.siteDescription,
    siteName: AppData.settings.siteName,
    images: [
      {
        url: '/img/og-image.jpg', // TODO: Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: AppData.settings.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: AppData.settings.siteName,
    description: AppData.settings.siteDescription,
    images: ['/img/og-image.jpg'], // TODO: Create this image
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

const Layouts = ({
  children
}) => {
  return (
    <html lang="bg" className={`${josefin_sans.variable} ${playfair_display.variable}`}>
      <head>
        <StructuredData />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body style={{ "backgroundImage": "url(" + AppData.settings.bgImage + ")" }}>
        <div className="tst-main-overlay"></div>

        {/* app wrapper */}
        <div id="tst-app" className="tst-app">
          {children}
        </div>
        {/* app wrapper end */}
      </body>
    </html>
  );
};
export default Layouts;
