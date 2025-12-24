const res = await fetch('http://localhost:3000/menu')
if (res.ok) {
  const html = await res.text()
  const hasMenu = html.includes('MenuFiltered') || html.includes('Меню')
  console.log('Menu page loaded:', res.status, res.statusText)
  console.log('Contains menu content:', hasMenu)
  if (html.includes('Шопска')) {
    console.log('✅ Found menu item "Шопска салата" - Sanity data is live!')
  }
} else {
  console.error('Failed:', res.status, res.statusText)
}

