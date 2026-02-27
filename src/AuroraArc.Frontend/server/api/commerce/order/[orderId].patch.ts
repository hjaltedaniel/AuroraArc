/**
 * PATCH /api/commerce/order/:orderId
 * Updates order-level fields: customer info, paymentMethod alias, shippingMethod alias.
 *
 * Body (all optional): UpdateOrderRequest
 *   { customer?: { firstName, lastName, email }, paymentMethod?: string, shippingMethod?: string }
 */

import type { CommerceOrder, UpdateOrderRequest } from '~~/shared/types/commerce'

export default defineEventHandler(async (event): Promise<CommerceOrder> => {
  const orderId = getRouterParam(event, 'orderId')
  if (!orderId) throw createError({ statusCode: 400, statusMessage: 'orderId is required' })

  const body = await readBody<UpdateOrderRequest>(event)

  return commerceFetch<CommerceOrder>(`/order/${orderId}`, {
    method: 'PATCH',
    body,
  })
})
