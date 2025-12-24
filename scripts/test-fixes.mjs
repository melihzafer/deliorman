console.log('🧪 Testing Sanity integration fixes...\n')

// Wait for server
await new Promise(r => setTimeout(r, 8000))

// Test Menu API (check category order)
console.log('1️⃣ Testing Menu Category Order...')
const menuRes = await fetch('http://localhost:3000/api/sanity/menu')
const menuData = await menuRes.json()
if (menuData.success && menuData.grouped) {
  const categories = Object.keys(menuData.grouped)
  console.log(`   ✅ First 5 categories:`)
  categories.slice(0, 5).forEach((cat, i) => {
    console.log(`      ${i + 1}. ${cat}`)
  })
} else {
  console.log('   ❌ Menu API failed')
}

// Test Promos API (check features and buttons)
console.log('\n2️⃣ Testing Promos (features & buttons)...')
const promosRes = await fetch('http://localhost:3000/api/sanity/promos')
const promosData = await promosRes.json()
if (promosData.success && promosData.promos) {
  promosData.promos.forEach((promo, i) => {
    console.log(`   ${i + 1}. ${promo.title}`)
    console.log(`      Features: ${promo.features ? promo.features.length : 0}`)
    console.log(`      Button: "${promo.buttonLabel || 'N/A'}" → ${promo.buttonLink || 'N/A'}`)
  })
} else {
  console.log('   ❌ Promos API failed')
}

console.log('\n✅ All tests complete!')

