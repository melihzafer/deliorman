import { SITE_URL } from "@/src/i18n/seo";

function toAbsoluteUrl(path = "") {
  if (!path) {
    return `${SITE_URL}/img/logo.webp`;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path}`;
}

export function BlogCollectionStructuredData({ posts }) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blog/#collection`,
    url: `${SITE_URL}/blog`,
    name: "Блог | Ресторант Делиорман",
    description: "Рецепти, новини и кулинарни идеи от екипа на ресторант Делиорман.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${post.id}`,
        name: post.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export function BlogArticleStructuredData({ post }) {
  const categories = Array.isArray(post.categories) ? post.categories : [];
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const keywords = [...categories, ...tags].join(", ");

  const payload = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.id}/#article`,
    headline: post.title,
    description: post.short,
    image: [toAbsoluteUrl(post.image)],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Ресторант Делиорман",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/img/logo.webp`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.id}`,
    inLanguage: "bg",
    ...(categories[0] ? { articleSection: categories[0] } : {}),
    ...(keywords ? { keywords } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
