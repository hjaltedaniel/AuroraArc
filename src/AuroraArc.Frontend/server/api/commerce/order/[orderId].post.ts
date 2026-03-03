/**
 * POST /api/commerce/order/:orderId
 * Adds a product line to the order.
 *
 * Body: AddOrderLineRequest
 *   { productReference: string, quantity: number }
 *
 * productReference must be the Umbraco content GUID (Product.contentId),
 * NOT the SKU string.
 */

import type { CommerceOrder, AddOrderLineRequest } from '~~/shared/types/commerce'

export default defineEventHandler(async (event): Promise<CommerceOrder> => {
  const orderId = getRouterParam(event, 'orderId')
  if (!orderId) throw createError({ statusCode: 400, statusMessage: 'orderId is required' })

  const body = await readBody<AddOrderLineRequest>(event)
  if (!body?.productReference) {
    throw createError({ statusCode: 400, statusMessage: 'productReference is required' })
  }

  return commerceFetch<CommerceOrder>(`/order/${orderId}`, {
    method: 'POST',
    body,
  })
})
