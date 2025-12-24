import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2025-01-01',
  useCdn: false,
})

console.log('Checking document publishing status...')

// Get all documents and check if they're published
const allDocs = await client.fetch('*[_type in ["menuItem", "promo", "callToAction"]]{_id, _type}')
console.log(`Total documents: ${allDocs.length}`)

const drafts = allDocs.filter(d => d._id.startsWith('drafts.'))
const published = allDocs.filter(d => !d._id.startsWith('drafts.'))

console.log(`Published: ${published.length}`)
console.log(`Drafts: ${drafts.length}`)

if (drafts.length > 0) {
  console.log('\n⚠️  You have unpublished drafts. They won\'t appear in public queries.')
  console.log('This is expected - our import creates published docs directly.')
}

// Check if published docs are actually readable without token
console.log('\nTesting public access to published docs...')
const publicClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2025-01-01',
  useCdn: false,
})

try {
  const publicResult = await publicClient.fetch('{"menu":count(*[_type=="menuItem"]),"promo":count(*[_type=="promo"])}')
  console.log('Public query result:', publicResult)

  if (publicResult.menu === 0 && publicResult.promo === 0) {
    console.log('\n❌ Public access is still blocked!')
    console.log('Checking dataset ACL mode...')

    // Check ACL mode via Management API
    const res = await client.request({
      url: `/projects/${process.env.SANITY_PROJECT_ID}/datasets/${process.env.SANITY_DATASET}`,
      method: 'GET',
    })
    console.log('Dataset ACL mode:', res.aclMode)
  } else {
    console.log('\n✅ Public access works!')
  }
} catch (e) {
  console.error('Public query failed:', e.message)
}

