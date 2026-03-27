/**
 * Structured Data (JSON-LD) Component
 * Provides rich snippets for search engines
 */
import MenuData from '@data/menu.json'

export default function StructuredData() {
  const canonicalBase = 'https://restorantdeliorman.com'

  // A stable Google Maps place/search URL helps Google connect the entity.
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D1%82%20%D0%94%D0%B5%D0%BB%D0%B8%D0%BE%D1%80%D0%BC%D0%B0%D0%BD%20%D0%A1%D0%B0%D0%BC%D1%83%D0%B8%D0%BB'

  const restaurant = {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'FoodEstablishment'],
    '@id': `${canonicalBase}/#restaurant`,
    name: 'Ресторант Делиорман',
    url: canonicalBase,
    description:
      'Ресторант Делиорман предлага уникално кулинарно изживяване с традиционни български и регионални ястия, приготвени с най-качествени местни продукти в уютна и автентична атмосфера.',

    image: [`${canonicalBase}/img/logo.webp`],
    logo: `${canonicalBase}/img/logo.webp`,

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
    menu: `${canonicalBase}/menu`,

    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Разград, България',
    },
    paymentAccepted: ['Cash', 'Card'],

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
      googleMapsUrl,
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

  // --- Menu schema built from actual menu data ---
  const foodCategories = [
    'Салати', 'Аламинути', 'Супи, Риба и Сандвичи', 'Пици',
    'Скара и Специалитети', 'Сач, Студени Мезета и Гарнитури',
    'Нови Специалитети', 'Десерти',
  ]

  const menuSections = MenuData.categories
    .filter((cat) => foodCategories.includes(cat.name))
    .map((cat) => ({
      '@type': 'MenuSection',
      name: cat.name,
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
    name: 'Меню на Ресторант Делиорман',
    url: `${canonicalBase}/menu`,
    inLanguage: 'bg',
    hasMenuSection: menuSections,
  }

  // --- BreadcrumbList schema ---
  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalBase}/#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Начало', item: canonicalBase },
      { '@type': 'ListItem', position: 2, name: 'Меню', item: `${canonicalBase}/menu` },
      { '@type': 'ListItem', position: 3, name: 'За нас', item: `${canonicalBase}/about` },
      { '@type': 'ListItem', position: 4, name: 'Галерия', item: `${canonicalBase}/gallery` },
      { '@type': 'ListItem', position: 5, name: 'Резервация', item: `${canonicalBase}/reservation` },
      { '@type': 'ListItem', position: 6, name: 'Контакти', item: `${canonicalBase}/contact` },
    ],
  }

  // --- FAQPage schema ---
  const faq = {
    '@type': 'FAQPage',
    '@id': `${canonicalBase}/#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Какво е работното време на Ресторант Делиорман?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ресторант Делиорман работи от понеделник до петък от 07:00 до 23:00 часа, а в събота и неделя от 07:00 до 00:00 часа.',
        },
      },
      {
        '@type': 'Question',
        name: 'Как мога да направя резервация в Ресторант Делиорман?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Можете да направите резервация онлайн чрез нашия уебсайт на страница „Резервация" или по телефон на +359 89 4766273. Препоръчваме резервация за групи над 6 човека и за уикенди.',
        },
      },
      {
        '@type': 'Question',
        name: 'Има ли паркинг до Ресторант Делиорман?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да, ресторантът разполага с безплатен паркинг за гостите си. Паркингът се намира непосредствено до входа на заведението в село Самуил, област Разград.',
        },
      },
      {
        '@type': 'Question',
        name: 'Предлагате ли кетъринг услуги?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да, предлагаме професионален кетъринг за всякакви събития — сватби, кръщенета, фирмени партита и семейни тържества. Минималната поръчка е от 10 порции. Свържете се с нас за индивидуална оферта.',
        },
      },
    ],
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
