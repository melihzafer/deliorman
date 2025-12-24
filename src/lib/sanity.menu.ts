import {sanityClient} from './sanity.client'
import {MENU_ITEMS_QUERY} from './sanity.queries'
import type {MenuItemDoc} from './menu.types'

export async function fetchMenuItems() {
  return sanityClient.fetch<MenuItemDoc[]>(MENU_ITEMS_QUERY)
}

