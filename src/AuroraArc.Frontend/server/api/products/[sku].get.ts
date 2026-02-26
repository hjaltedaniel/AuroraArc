import { fetchAllProducts } from '~~/server/utils/composeProducts'

export default defineEventHandler(async (event) => {
  const identifier = getRouterParam(event, 'sku')

  const products = await fetchAllProducts()

  const product = products.find(
    p => p.sku === identifier || p.slug === identifier,
  )

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }

  return product
})
