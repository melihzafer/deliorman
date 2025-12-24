// Schema index for the standalone Sanity Studio.
//
// NOTE:
// This Studio is isolated and uses its own `studio/node_modules`.
// Avoid importing schema objects from the Next.js app folder (`src/`) because
// it causes type mismatches when two different `sanity/@sanity/types` copies are loaded.

export {blogPost} from './blogPost'
export {callToAction} from './callToAction'
export {menuItem} from './menuItem'
export {promo} from './promo'

import {blogPost} from './blogPost'
import {callToAction} from './callToAction'
import {menuItem} from './menuItem'
import {promo} from './promo'

export const schemaTypes = [menuItem, promo, blogPost, callToAction]
