import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2025-01-01',
})

const projectId = process.env.SANITY_PROJECT_ID

console.log('Adding CORS origin for localhost...')

try {
  // Add localhost:3000 to allowed origins
  const res = await client.request({
    url: `/projects/${projectId}/cors`,
    method: 'POST',
    body: {
      origin: 'http://localhost:3000',
      allowCredentials: false,
    }
  })
  console.log('✅ Added CORS origin')
} catch (e) {
  if (e.statusCode === 409) {
    console.log('✅ CORS origin already exists')
  } else {
    console.error('Failed:', e.responseBody || e.message)
  }
}

// Also check if we need to make documents themselves public (not just dataset)
console.log('\nChecking document-level access...')
const docs = await client.fetch('*[_type=="promo"][0...1]{_id,_type,title}')
console.log('Sample promo docs:', docs)

