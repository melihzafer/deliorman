import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@library/posts'
import { routing } from '@/src/i18n/routing'
import {
  SITE_URL,
  getAlternateLanguages,
  getLocalizedUrl,
} from '@/src/i18n/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const posts = getSortedPostsData()

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
    '/shop',
    '/products',
    '/feedback',
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

  const postUrls: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${SITE_URL}/blog/${post.id}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const blogIndexUrl: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  return [...staticUrls, ...blogIndexUrl, ...postUrls]
}
