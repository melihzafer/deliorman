import { getClientIp } from '../src/app/_lib/client-ip.js'

function makeRequest(headersObj) {
  return {
    headers: {
      get(name) {
        const key = String(name).toLowerCase()
        const v = headersObj[key]
        return v == null ? null : String(v)
      },
    },
  }
}

const cases = [
  {
    name: 'Vercel x-vercel-ip',
    headers: { 'x-vercel-ip': '198.51.100.7' },
  },
  {
    name: 'XFF chain (pick first)',
    headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.1' },
  },
  {
    name: 'Forwarded header',
    headers: { forwarded: 'for=203.0.113.43;proto=https;by=203.0.113.44' },
  },
  {
    name: 'Forwarded quoted IPv6 with port',
    headers: { forwarded: 'for="[2001:db8:cafe::17]:4711";proto=https' },
  },
  {
    name: 'No headers (dev fallback)',
    headers: {},
  },
]

for (const c of cases) {
  const req = makeRequest(Object.fromEntries(Object.entries(c.headers).map(([k, v]) => [k.toLowerCase(), v])))
  const info = getClientIp(req)
  console.log(`\n--- ${c.name} ---`)
  console.log('headers:', c.headers)
  console.log('result:', info)
}

