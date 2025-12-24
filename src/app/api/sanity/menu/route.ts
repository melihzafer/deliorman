import {NextResponse} from 'next/server'

import {sanityClient} from '../../../../lib/sanity.client'
import {MENU_ITEMS_QUERY} from '../../../../lib/sanity.queries'
import type {MenuItemDoc} from '../../../../lib/menu.types'
import {groupMenuItemsByCategory} from '../../../../lib/menu.grouping'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const items = await sanityClient.fetch<MenuItemDoc[]>(MENU_ITEMS_QUERY)

    return NextResponse.json({
      success: true,
      count: items.length,
      items,
      grouped: groupMenuItemsByCategory(items),
    })
  } catch (error) {
    console.error('Sanity menu API error:', error)
    return NextResponse.json(
      {success: false, error: 'Failed to fetch menu data from Sanity'},
      {status: 500}
    )
  }
}
