import type {MenuItemDoc} from './menu.types'

export function groupMenuItemsByCategory(items: MenuItemDoc[]) {
  const groups: Record<string, MenuItemDoc[]> = {}
  for (const item of items) {
    const key = item.category || 'Без категория'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }
  return groups
}

