import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    '6sdtxnoz',
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    'production',
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    process.env.SANITY_API_VERSION ||
    '2025-01-01',
  token: process.env.SANITY_TOKEN, // server-side only (do not expose to browser)
  useCdn: false,
  perspective: 'published',
})
