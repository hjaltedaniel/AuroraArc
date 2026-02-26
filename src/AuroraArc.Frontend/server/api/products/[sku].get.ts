import { products } from '~~/server/utils/products'

export default defineEventHandler((event) => {
  const sku = getRouterParam(event, 'sku')

  const product = products.find(
    p => p.sku === sku || p.slug === sku,
  )

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }

  return product
})
