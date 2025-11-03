/**
 * Structured Data (JSON-LD) Component
 * Provides rich snippets for search engines
 */
export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Ресторант Делиорман',
    description: 'Ресторант Делиорман предлага уникално кулинарно изживяване с традиционни български и регионални ястия, приготвени с най-качествени местни продукти в уютна и автентична атмосфера.',
    image: 'https://deliorman.com/img/logo.png', // TODO: Update domain
    '@id': 'https://deliorman.com', // TODO: Update domain
    url: 'https://deliorman.com', // TODO: Update domain
    telephone: '+359-XX-XXX-XXXX', // TODO: Add real phone
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Address Here', // TODO: Add real address
      addressLocality: 'City',
      postalCode: 'XXXXX',
      addressCountry: 'BG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.513633,
      longitude: 26.740900,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '11:00',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '00:00',
      },
    ],
    servesCuisine: ['Bulgarian', 'Traditional', 'European'],
    acceptsReservations: 'True',
    menu: 'https://deliorman.com/menu', // TODO: Update domain
    sameAs: [
      // TODO: Add social media profiles
      // 'https://www.facebook.com/deliorman',
      // 'https://www.instagram.com/deliorman',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
