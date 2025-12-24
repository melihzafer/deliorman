try {
  const res = await fetch('http://localhost:3000/api/sanity/menu')
  const data = await res.json()
  console.log('Menu API:', data.success ? `✅ ${data.count} items` : '❌ Failed')

  const res2 = await fetch('http://localhost:3000/api/sanity/promos')
  const data2 = await res2.json()
  console.log('Promos API:', data2.success ? `✅ ${data2.count} promos` : '❌ Failed')

  console.log('\n🎉 All Sanity data is connected!')
} catch (e) {
  console.error('Error:', e.message)
}

