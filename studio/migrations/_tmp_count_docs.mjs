import {createClient} from '@sanity/client'
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})
const q = '{"menu":count(*[_type=="menuItem"]),"cta":count(*[_type=="callToAction"]),"promo":count(*[_type=="promo"]) }'
const res = await client.fetch(q)
console.log(JSON.stringify(res, null, 2))
