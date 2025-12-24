try {
  const res = await fetch('http://localhost:3000/api/sanity/promos')
  const data = await res.json()
  console.log('Promos count:', data.count)
  if (data.promos && data.promos[0]) {
    const first = data.promos[0]
    console.log('First promo:', first.title)
    console.log('Features:', first.features ? first.features.length : 0)
    console.log('Button:', first.buttonLabel, '->', first.buttonLink)
  }
} catch (e) {
  console.error('Error:', e.message)
}

