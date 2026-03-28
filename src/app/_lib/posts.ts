import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

import type { PostEntry, PostFrontmatter, PostSummary } from '@/src/types'

const postsDirectory = path.join(process.cwd(), 'src/data/posts')
const jsonDir = "src/data/.json";

// In-memory cache for parsed markdown posts. SSG-safe because Next.js builds
// run in a single process — the cache is populated once on first access and
// reused for every subsequent call, eliminating repeated O(n) disk reads.
let postsCache: PostEntry[] | null = null

function loadAllPosts(): PostEntry[] {
  if (postsCache) return postsCache

  const fileNames = fs.readdirSync(postsDirectory)
  postsCache = fileNames
    .filter((fileName) => fileName.includes('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      return { id, content: matterResult.content, data: matterResult.data as PostFrontmatter }
    })

  return postsCache
}

/** Reset the in-memory cache so the next call re-reads from disk. */
export function clearPostsCache(): void {
  postsCache = null
}

function sortByDateDesc(a: PostSummary, b: PostSummary): number {
  return a.date < b.date ? 1 : -1
}

export function getSortedPostsData(): PostSummary[] {
  const posts = loadAllPosts().map(({ id, data }) => ({ id, ...data }))
  return posts.sort(sortByDateDesc)
}

export function getCategoryPosts(cat_id: string): PostSummary[] {
  const allData: PostSummary[] = []
  for (const { id, data } of loadAllPosts()) {
    const cats = data.categories
    if ( cats != undefined ) {
      const catsSlug = cats.map(element => {
        return element.toLowerCase().replaceAll(' ', '-');
      });

      if ( catsSlug != undefined ) {
        if ( catsSlug.includes(cat_id) ) {
          allData.push({ id, ...data });
        }
      }
    }
  }
  return allData.sort(sortByDateDesc)
}

export function getTagPosts(tag_id: string): PostSummary[] {
  const allData: PostSummary[] = []
  for (const { id, data } of loadAllPosts()) {
    const tags = data.tags
    if ( tags != undefined ) {
      const tagsSlug = tags.map(element => {
        return element.toLowerCase().replaceAll(' ', '-');
      });

      if ( tagsSlug != undefined ) {
        if ( tagsSlug.includes(tag_id) ) {
          allData.push({ id, ...data });
        }
      }
    }
  }
  return allData.sort(sortByDateDesc)
}

export function getAuthorPosts(author_id: string): PostSummary[] {
  const allData: PostSummary[] = []
  for (const { id, data } of loadAllPosts()) {
    const author = data.author.toLowerCase().replaceAll(' ', '-');
    if ( author == author_id ) {
      allData.push({ id, ...data });
    }
  }
  return allData.sort(sortByDateDesc)
}

export function getArchivePosts(archive_id: string): PostSummary[] {
  const allData: PostSummary[] = []
  for (const { id, data } of loadAllPosts()) {
    const dateObj = new Date(data.date);
    const dateSlug = (dateObj.getMonth()+1)+'-'+dateObj.getFullYear();
    if ( dateSlug == archive_id ) {
      allData.push({ id, ...data });
    }
  }
  return allData.sort(sortByDateDesc)
}

export function getPaginatedPostsData(limit: number, page: number): { posts: PostSummary[]; total: number } {
  const allPostsData = loadAllPosts()
    .map(({ id, data }) => ({ id, ...data }))
    .sort(sortByDateDesc)

  const paginatedPosts = allPostsData.slice((page - 1) * limit, page * limit)
  return { posts: paginatedPosts, total: allPostsData.length }
}

export function getFeaturedPostsData(ids: string[]): PostSummary[] {
  const allData: PostSummary[] = []
  for (const { id, data } of loadAllPosts()) {
    if ( ids.includes(id) ) {
      allData.push({ id, ...data });
    }
  }
  return allData.sort(sortByDateDesc)
}

export function getRelatedPosts(current_id: string): PostSummary[] {
  const allData: PostSummary[] = [];
  for (const { id, data } of loadAllPosts()) {
    if ( id != current_id ) {
      allData.push({ id, ...data });
    }
  }
  return allData.sort((a, b) => {
    const catA = String((a as Record<string, unknown>).category ?? '');
    const catB = String((b as Record<string, unknown>).category ?? '');
    return catA > catB ? 1 : -1;
  })
}

export function getAllPostsIds(): { params: { id: string } }[] {
  return loadAllPosts().map(({ id }) => ({
    params: { id }
  }))
}

export async function getPostData(id: string): Promise<(PostFrontmatter & { id: string; contentHtml: string }) | undefined> {
  const post = loadAllPosts().find((p) => p.id === id)
  if (!post) return;

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(post.content)
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...post.data
  }
}

export async function generateJsonPostsData(): Promise<void> {
  const posts = loadAllPosts()
    .map(({ id, content, data }) => ({ id, content, ...data }))
    .sort(sortByDateDesc)

  // Create JSON File
  try {
    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir);
    }
    fs.writeFileSync(`${jsonDir}/posts.json`, JSON.stringify(posts));
  } catch (err) {
    console.error(err);
  }
}
