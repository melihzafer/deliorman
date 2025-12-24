import { type SchemaTypeDefinition } from 'sanity'

import { blogPost } from './blogPost'
import { callToAction } from './callToAction'
import { menuItem } from './menuItem'
import { promo } from './promo'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [menuItem, promo, blogPost, callToAction],
}
