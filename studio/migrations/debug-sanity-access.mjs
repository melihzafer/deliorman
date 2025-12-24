import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

console.log('Testing with token auth...')
const result = await client.fetch('{"menu":count(*[_type=="menuItem"]),"promo":count(*[_type=="promo"])}')
console.log('With token:', JSON.stringify(result, null, 2))

// Test without token (public)
const publicClient = createClient({
  projectId: '6sdtxnoz',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
})

console.log('\nTesting without token (public)...')
try {
  const publicResult = await publicClient.fetch('{"menu":count(*[_type=="menuItem"]),"promo":count(*[_type=="promo"])}')
  console.log('Without token:', JSON.stringify(publicResult, null, 2))
} catch (e) {
  console.error('Public query failed:', e.message)
}

