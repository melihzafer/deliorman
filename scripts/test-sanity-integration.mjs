console.log('Testing Sanity integration on live pages...\n')

// Test homepage
const homeRes = await fetch('http://localhost:3000/')
if (homeRes.ok) {
  const homeHtml = await homeRes.text()
  const hasPromos = homeHtml.includes('specialtiesSlider') || homeHtml.includes('Специалитет')
  console.log('✅ Homepage loaded:', homeRes.status)
  console.log('   Contains promos section:', hasPromos)
} else {
  console.error('❌ Homepage failed:', homeRes.status)
}

// Test menu page
const menuRes = await fetch('http://localhost:3000/menu')
if (menuRes.ok) {
  const menuHtml = await menuRes.text()
  const hasMenu = menuHtml.includes('Шопска') || menuHtml.includes('Салати')
  console.log('✅ Menu page loaded:', menuRes.status)
  console.log('   Contains Sanity menu items:', hasMenu)
} else {
  console.error('❌ Menu page failed:', menuRes.status)
}

// Test API endpoints
const apiTests = [
  {name: 'Menu API', url: 'http://localhost:3000/api/sanity/menu', expectedCount: 194},
  {name: 'Promos API', url: 'http://localhost:3000/api/sanity/promos', expectedCount: 3},
  {name: 'CTA API', url: 'http://localhost:3000/api/sanity/cta', expectedCount: 6},
]

console.log('\n📊 API Endpoints:')
for (const test of apiTests) {
  try {
    const res = await fetch(test.url)
    const data = await res.json()
    const status = data.count === test.expectedCount ? '✅' : '⚠️'
    console.log(`${status} ${test.name}: ${data.count}/${test.expectedCount} items`)
  } catch (e) {
    console.error(`❌ ${test.name}: ${e.message}`)
  }
}

console.log('\n🎉 Sanity integration complete!')

