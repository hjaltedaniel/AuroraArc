import { fetchAllProducts } from '~~/server/utils/composeProducts'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  let filtered = await fetchAllProducts()

  // Filter by category
  if (query.category) {
    filtered = filtered.filter(p => p.category === query.category)
  }

  // Filter by activity
  if (query.activity) {
    filtered = filtered.filter(p => p.activities.includes(query.activity as any))
  }

  // Filter by tech level
  if (query.techLevel) {
    filtered = filtered.filter(p => p.techLevel === query.techLevel)
  }

  // Filter featured only
  if (query.featured === 'true') {
    filtered = filtered.filter(p => p.featured)
  }

  // Filter limited drops only
  if (query.limitedDrop === 'true') {
    filtered = filtered.filter(p => p.limitedDrop)
  }

  // Sorting
  const sort = (query.sort as string) || 'featured'
  switch (sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'featured':
    default:
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      break
  }

  return filtered
})
