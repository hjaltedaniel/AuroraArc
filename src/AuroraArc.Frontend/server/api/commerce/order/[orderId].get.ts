/**
 * GET /api/commerce/order/:orderId
 * Fetches a Commerce order by ID.
 */

import type { CommerceOrder } from '~~/shared/types/commerce'

export default defineEventHandler(async (event): Promise<CommerceOrder> => {
  const orderId = getRouterParam(event, 'orderId')
  if (!orderId) throw createError({ statusCode: 400, statusMessage: 'orderId is required' })

  return commerceFetch<CommerceOrder>(`/order/${orderId}`)
})
