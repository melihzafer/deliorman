import imageUrlBuilder from '@sanity/image-url'

import {sanityClient} from './sanity.client'

/**
 * Avoid importing types from internal @sanity/image-url paths, since they can change between versions.
 * This type covers common Sanity image sources accepted by the URL builder.
 */
export type SanityImageSource =
  | string
  | {
      _ref?: string
      _id?: string
      asset?: { _ref?: string; _id?: string }
      [key: string]: unknown
    }
  | null
  | undefined

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source as any)
}
