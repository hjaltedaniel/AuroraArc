/**
 * DELETE /api/commerce/order/:orderId/item/:lineId
 * Removes an order line entirely.
 */

import type { CommerceOrder } from '~~/shared/types/commerce'

export default defineEventHandler(async (event): Promise<CommerceOrder> => {
  const orderId = getRouterParam(event, 'orderId')
  const lineId  = getRouterParam(event, 'lineId')

  if (!orderId) throw createError({ statusCode: 400, statusMessage: 'orderId is required' })
  if (!lineId)  throw createError({ statusCode: 400, statusMessage: 'lineId is required' })

  return commerceFetch<CommerceOrder>(`/order/${orderId}/item/${lineId}`, {
    method: 'DELETE',
  })
})
