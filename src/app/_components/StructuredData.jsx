/**
 * Structured Data (JSON-LD) Component
 * Provides rich snippets for search engines
 */
import { getLocalizedMenuData } from '@data/getLocalizedMenuData'
import { getRestaurantPhoneDisplay, getRestaurantPhoneNormalized } from '@library/siteContact'
import { getLocale, getTranslations } from 'next-intl/server'
import { getLocalizedUrl } from '@/src/i18n/seo'

export default async function StructuredData() {
  const locale = await getLocale()
  const menuData = getLocalizedMenuData(locale)
  const tMeta = await getTranslations('meta')
  const tMenu = await getTranslations('menu')
  const tStructured = await getTranslations('structuredData')
  const canonicalBase = 'https://restorantdeliorman.com'
  const restaurantPhoneDisplay = getRestaurantPhoneDisplay()
  const restaurantPhoneNormalized = getRestaurantPhoneNormalized()
  const categoryLabels = tMenu.raw('categories')
  const faqContent = tStructured.raw('faq')
  const breadcrumbLabels = tStructured.raw('breadcrumbs')

  // A stable Google Maps place/search URL helps Google connect the entity.
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D1%82%20%D0%94%D0%B5%D0%BB%D0%B8%D0%BE%D1%80%D0%BC%D0%B0%D0%BD%20%D0%A1%D0%B0%D0%BC%D1%83%D0%B8%D0%BB'

  const restaurant = {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'FoodEstablishment'],
    '@id': `${canonicalBase}/#restaurant`,
    name: tMeta('siteName'),
    url: canonicalBase,
    description: tStructured('restaurantDescription'),

    image: [`${canonicalBase}/img/logo.webp`],
    logo: `${canonicalBase}/img/logo.webp`,

    telephone: restaurantPhoneNormalized,
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

    hasMap: googleMapsUrl,

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
    menu: getLocalizedUrl('/menu', locale),

    areaServed: {
      '@type': 'AdministrativeArea',
      name: tStructured('areaServed'),
    },
    paymentAccepted: ['Cash', 'Card'],

    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: restaurantPhoneNormalized,
        contactType: 'reservations',
        availableLanguage: ['bg', 'en', 'tr'],
      },
    ],

    sameAs: [
      'https://www.facebook.com/p/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D1%82-%D0%94%D0%B5%D0%BB%D0%B8%D0%BE%D1%80%D0%BC%D0%B0%D0%BD-100078695683893/',
      'https://www.instagram.com/restorant_deliorman/',
      'https://www.tiktok.com/@restorantdeliorman',
      googleMapsUrl,
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${canonicalBase}/#website`,
    url: canonicalBase,
    name: tMeta('siteName'),
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${canonicalBase}/search?term={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const foodCategorySlugs = [
    'salads',
    'hot-appetizers',
    'soups-sandwiches',
    'pizzas',
    'grill',
    'saj-fish-specialties',
    'burgers',
    'new-specialties',
    'cold-appetizers-sides',
    'nuts-desserts',
  ]

  const menuSections = menuData.categories
    .filter((cat) => foodCategorySlugs.includes(cat.slug))
    .map((cat) => ({
      '@type': 'MenuSection',
      name: categoryLabels?.[cat.slug] || cat.name,
      hasMenuItem: cat.items.slice(0, 6).map((item) => ({
        '@type': 'MenuItem',
        name: item.title,
        ...(item.text ? { description: item.text } : {}),
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'BGN',
        },
      })),
    }))

  const menu = {
    '@type': 'Menu',
    '@id': `${canonicalBase}/#menu`,
    name: tStructured('menuName'),
    url: getLocalizedUrl('/menu', locale),
    inLanguage: locale,
    hasMenuSection: menuSections,
  }

  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalBase}/#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: breadcrumbLabels.home, item: canonicalBase },
      { '@type': 'ListItem', position: 2, name: breadcrumbLabels.menu, item: getLocalizedUrl('/menu', locale) },
      { '@type': 'ListItem', position: 3, name: breadcrumbLabels.about, item: getLocalizedUrl('/about', locale) },
      { '@type': 'ListItem', position: 4, name: breadcrumbLabels.gallery, item: getLocalizedUrl('/gallery', locale) },
      { '@type': 'ListItem', position: 5, name: breadcrumbLabels.reservation, item: getLocalizedUrl('/reservation', locale) },
      { '@type': 'ListItem', position: 6, name: breadcrumbLabels.contact, item: getLocalizedUrl('/contact', locale) },
    ],
  }

  const faq = {
    '@type': 'FAQPage',
    '@id': `${canonicalBase}/#faq`,
    mainEntity: faqContent.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
          .replace('{phone}', restaurantPhoneDisplay)
          .replace('{ordersPhone}', '+359 89 608 8804')
          .replace('{reservationsPhone}', '+359 89 476 62273'),
      },
    })),
  }

  const payload = {
    '@context': 'https://schema.org',
    '@graph': [website, restaurant, menu, breadcrumbs, faq],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
