import { MetadataRoute } from 'next'
import { routing } from '@/src/i18n/routing'
import {
  SITE_URL,
  getAlternateLanguages,
  getLocalizedUrl,
} from '@/src/i18n/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localizedPages = [
    '/about',
    '/menu',
    '/lunch-menu',
    '/reservation',
    '/terms',
    '/gallery',
    '/history',
    '/catering-services',
    '/services',
    '/special-days',
    '/contact',
    '/feedback',
    '/search',
  ]

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...localizedPages.flatMap((route) =>
      routing.locales.map((locale) => ({
        url: getLocalizedUrl(route, locale),
        alternates: {
          languages: getAlternateLanguages(route),
        },
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: locale === routing.defaultLocale ? 0.8 : 0.7,
      }))
    ),
  ].filter((entry, index, allEntries) => {
    return allEntries.findIndex(({ url }) => url === entry.url) === index
  })

  return [...staticUrls]
}
