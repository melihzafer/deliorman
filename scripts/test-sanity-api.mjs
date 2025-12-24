const res1 = await fetch('http://localhost:3000/api/sanity/promos')
const data1 = await res1.json()
console.log('Promos:', data1.success, 'count:', data1.count)
if (data1.count > 0) console.log('  First:', data1.promos[0].title)

const res2 = await fetch('http://localhost:3000/api/sanity/menu')
const data2 = await res2.json()
console.log('Menu:', data2.success, 'count:', data2.count)
if (data2.count > 0) console.log('  First:', data2.items[0].title)

