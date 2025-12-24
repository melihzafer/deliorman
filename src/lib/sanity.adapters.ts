import {sanityClient} from './sanity.client'
import {MENU_ITEMS_QUERY, ACTIVE_PROMOS_QUERY, CTA_QUERY} from './sanity.queries'
import {groupMenuItemsByCategory} from './menu.grouping'
import type {MenuItemDoc} from './menu.types'

/**
 * Adapter: Transform Sanity menu items to legacy JSON format
 * Used by MenuFiltered component
 */
export async function getMenuCategories() {
  const items = await sanityClient.fetch<MenuItemDoc[]>(MENU_ITEMS_QUERY)
  const grouped = groupMenuItemsByCategory(items)

  // Category order from original menu.json (not alphabetical)
  const categoryOrder = [
    'Безалкохолни и Топли Напитки',
    'Салати',
    'Аламинути',
    'Супи, Риба и Сандвичи',
    'Пици',
    'Скара и Специалитети',
    'Сач, Студени Мезета и Гарнитури',
    'Нови Специалитети',
    'Десерти',
    'Бира',
    'Ракии',
    'Бели и Червени Вина',
    'Водка и Други Напитки',
    'Уиски и Ядки',
  ]

  // Sort categories by original order
  const sortedCategories = categoryOrder
    .filter((catName) => grouped[catName]) // Only include categories that exist
    .map((categoryName) => ({
      name: categoryName,
      slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      items: grouped[categoryName].map((item) => ({
        title: item.title,
        price: item.price,
        amount: item.weight || '',
        text: item.description || '',
      })),
    }))

  return sortedCategories
}

/**
 * Fetch active promos from Sanity
 */
export async function getActivePromos() {
  return sanityClient.fetch(ACTIVE_PROMOS_QUERY)
}

/**
 * Fetch CTAs from Sanity
 */
export async function getCTAs() {
  return sanityClient.fetch(CTA_QUERY)
}

