import { Suspense } from "react";

import Link from "next/link";

import SearchBarModule from '@components/SearchBar';

import { getSortedArchivesData } from "@library/archives";
import { getSortedCategoriesData } from "@library/categories";
import { getSortedTagsData } from "@library/tags";
import { getSortedAuthorsData } from "@library/authors";

async function Sidebar() {
  const archives = await getAllArchives();
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const authors = await getAllAuthors();

  return (
    <>
        {/* sidebar */}
        <div className="tst-sidebar">
            <div className="tst-ib-title-frame tst-mb-30">
                <h4>Search</h4>
                <i className="fas fa-arrow-down" />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchBarModule />
            </Suspense>

            <div className="tst-ib-title-frame tst-mb-30">
                <h4>Categories</h4>
                <i className="fas fa-arrow-down" />
            </div>
            <ul className="tst-list tst-mb-30">
                {categories.map((item, key) => (
                <li key={`sidebar-categories-item-${key}`}><b><Link href={`/blog/category/${item.id}`}>{item.title}</Link></b></li>
                ))}
            </ul>

            <div className="tst-ib-title-frame tst-mb-30">
                <h4>Archives</h4>
                <i className="fas fa-arrow-down" />
            </div>
            <ul className="tst-list tst-mb-30">
                {archives.map((item, key) => (
                <li key={`sidebar-archives-item-${key}`}><b><Link href={`/blog/archive/${item.id}`}>{item.month}, {item.year}</Link></b></li>
                ))}
            </ul>

            <div className="tst-ib-title-frame tst-mb-30">
                <h4>Authors</h4>
                <i className="fas fa-arrow-down" />
            </div>
            <ul className="tst-list tst-mb-30">
                {authors.map((item, key) => (
                <li key={`sidebar-author-item-${key}`}><b><Link href={`/blog/author/${item.id}`}>{item.title}</Link></b></li>
                ))}
            </ul>

            <div className="tst-ib-title-frame tst-mb-30">
                <h4>Keywords</h4>
                <i className="fas fa-arrow-down" />
            </div>
            <ul className="tst-keywords">
                {tags.map((item, key) => (
                <li key={`sidebar-tags-item-${key}`}><Link href={`/blog/tag/${item.id}`}>{item.title}</Link></li>
                ))}
            </ul>
        </div>
        {/* sidebar end */}
    </>
  );
};
export default Sidebar;

async function getAllArchives() {
    const archivesData = await getSortedArchivesData()

    if ( !archivesData ) {
        return [];
    } else {
        return archivesData
    }
}

async function getAllCategories() {
    const categoriesData = await getSortedCategoriesData()

    if ( !categoriesData ) {
        return [];
    } else {
        return categoriesData
    }
}

async function getAllTags() {
    const tagsData = await getSortedTagsData()

    if ( !tagsData ) {
        return [];
    } else {
        return tagsData
    }
}

async function getAllAuthors() {
    const authorsData = await getSortedAuthorsData()

    if ( !authorsData ) {
        return [];
    } else {
        return authorsData
    }
}