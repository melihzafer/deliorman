import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://restorantdeliorman.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/search?'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
