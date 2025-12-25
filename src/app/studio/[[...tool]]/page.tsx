/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

export const dynamic = 'force-static'

export default function StudioPage() {
  return (
    <div style={{maxWidth: 720, margin: '60px auto', padding: '0 20px'}}>
      <h1>Sanity Studio</h1>
      <p>
        Studio-то е отделен проект и не е вградено в сайта, за да няма конфликт на зависимости при
        build/deploy.
      </p>
      <p>
        Стартира се от папка <code>studio/</code>:
      </p>
      <pre style={{background: '#f6f8fa', padding: 12, borderRadius: 8, overflowX: 'auto'}}>
        cd studio

        npm install

        npm run dev
      </pre>
    </div>
  )
}
