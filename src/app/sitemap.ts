import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@library/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://deliorman.com' // TODO: Update with your actual domain
  
  // Get all blog posts
  const posts = getSortedPostsData()
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/menu',
    '/menu-2',
    '/lunch-menu',
    '/reservation',
    '/reservation-2',
    '/gallery',
    '/history',
    '/catering-services',
    '/services',
    '/special-days',
    '/contact',
    '/shop',
    '/products',
  ]
  
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))
  
  // Dynamic blog post URLs
  const postUrls: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
  
  return [...staticUrls, ...postUrls]
}
