import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.restorantdeliorman.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/search?',
          '/masa',
          '/table',
          '/en/table',
          '/tr/table',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
