/**
 * PATCH /api/commerce/order/:orderId/item/:lineId
 * Updates the quantity of an existing order line.
 *
 * Body: UpdateOrderLineRequest
 *   { quantity: number }
 */

import type { CommerceOrder, UpdateOrderLineRequest } from '~~/shared/types/commerce'

export default defineEventHandler(async (event): Promise<CommerceOrder> => {
  const orderId = getRouterParam(event, 'orderId')
  const lineId  = getRouterParam(event, 'lineId')

  if (!orderId) throw createError({ statusCode: 400, statusMessage: 'orderId is required' })
  if (!lineId)  throw createError({ statusCode: 400, statusMessage: 'lineId is required' })

  const body = await readBody<UpdateOrderLineRequest>(event)
  if (typeof body?.quantity !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'quantity (number) is required' })
  }

  return commerceFetch<CommerceOrder>(`/order/${orderId}/item/${lineId}`, {
    method: 'PATCH',
    body,
  })
})
