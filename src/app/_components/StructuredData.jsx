/**
 * Structured Data (JSON-LD) Component
 * Provides rich snippets for search engines
 */
export default function StructuredData() {
  const canonicalBase = 'https://restorantdeliorman.com'

  const restaurant = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${canonicalBase}/#restaurant`,
    name: 'Ресторант Делиорман',
    url: canonicalBase,
    description:
      'Ресторант Делиорман предлага уникално кулинарно изживяване с традиционни български и регионални ястия, приготвени с най-качествени местни продукти в уютна и автентична атмосфера.',
    image: `${canonicalBase}/img/logo.png`,
    telephone: '+359894766273',
    email: 'restaurantdeliorman@gmail.com',
    priceRange: '$$',

    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. "Хаджи Димитър" №6',
      addressLocality: 'Самуил',
      postalCode: '7451',
      addressRegion: 'Разград',
      addressCountry: 'BG',
    },

    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.513633,
      longitude: 26.7409,
    },

    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '07:00',
        closes: '00:00',
      },
    ],

    servesCuisine: ['Bulgarian', 'Traditional', 'European'],
    acceptsReservations: true,
    menu: `${canonicalBase}/menu`,

    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+359894766273',
        contactType: 'reservations',
        availableLanguage: ['bg'],
      },
    ],

    sameAs: [
      'https://www.facebook.com/p/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D1%82-%D0%94%D0%B5%D0%BB%D0%B8%D0%BE%D1%80%D0%BC%D0%B0%D0%BD-100078695683893/',
      'https://www.instagram.com/restorant_deliorman/',
      'https://www.tiktok.com/@restorantdeliorman',
      'https://share.google/juRTw0AN3iIrlChl1',
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${canonicalBase}/#website`,
    url: canonicalBase,
    name: 'Ресторант Делиорман',
    inLanguage: 'bg',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${canonicalBase}/search?term={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const payload = {
    '@context': 'https://schema.org',
    '@graph': [website, restaurant],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}}
    />
  )
}
