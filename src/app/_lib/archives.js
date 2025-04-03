import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src/data/posts')

export function getSortedArchivesData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  
  const allPostsData = fileNames.filter((fileName) => fileName.includes('.md')).map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  const allSortedPosts = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })

  const archives = [];
  const monthOptions = { month: "long" };
  const yearsOptions = { year: "numeric" };

  allSortedPosts.map((item, index) => {
    let dateObj = new Date(item.date);
    
    let itemObj = {
        "id": (dateObj.getMonth()+1)+'-'+dateObj.getFullYear(),
        "month": new Intl.DateTimeFormat("en-US", monthOptions).format(dateObj),
        "year": new Intl.DateTimeFormat("en-US", yearsOptions).format(dateObj)
    }
    if ( !archives.some(e => e.id === itemObj.id) ){
        archives.push(itemObj)
    }
  });

  return archives
}

export function getAllArchivesIds() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    
    const allPostsData = fileNames.filter((fileName) => fileName.includes('.md')).map(fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '')
  
      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
  
      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents)
  
      // Combine the data with the id
      return {
        id,
        ...matterResult.data
      }
    })
    // Sort posts by date
    const allSortedPosts = allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
  
    const archives = [];
    const monthOptions = { month: "long" };
    const yearsOptions = { year: "numeric" };
  
    allSortedPosts.map((item, index) => {
      let dateObj = new Date(item.date);
      
      let itemObj = {
          "id": (dateObj.getMonth()+1)+'-'+dateObj.getFullYear(),
          "month": new Intl.DateTimeFormat("en-US", monthOptions).format(dateObj),
          "year": new Intl.DateTimeFormat("en-US", yearsOptions).format(dateObj)
      }
      if ( !archives.some(e => e.id === itemObj.id) ){
          archives.push(itemObj)
      }
    });
    
    archives.map((item) => {
        return {
            params: {
              id: item.id
            }
        }
    });
}

export async function getArchiveData(id) {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    
    const allPostsData = fileNames.filter((fileName) => fileName.includes('.md')).map(fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '')
  
      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
  
      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents)
  
      // Combine the data with the id
      return {
        id,
        ...matterResult.data
      }
    })
    // Sort posts by date
    const allSortedPosts = allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
  
    const archives = [];
    const monthOptions = { month: "long" };
    const yearsOptions = { year: "numeric" };
  
    allSortedPosts.map((item, index) => {
      let dateObj = new Date(item.date);
      
      let itemObj = {
          "id": (dateObj.getMonth()+1)+'-'+dateObj.getFullYear(),
          "month": new Intl.DateTimeFormat("en-US", monthOptions).format(dateObj),
          "year": new Intl.DateTimeFormat("en-US", yearsOptions).format(dateObj)
      }
      if ( !archives.some(e => e.id === itemObj.id) ){
          archives.push(itemObj)
      }
    });

    let archiveData = [];

    archives.map((item) => {
        if ( item.id == id ) {
            archiveData = item;
        }
    })

    return archiveData
  }