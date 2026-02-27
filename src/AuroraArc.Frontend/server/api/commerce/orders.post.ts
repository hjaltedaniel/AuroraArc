/**
 * POST /api/commerce/orders
 * Creates a new Commerce order and returns the full order object.
 */

import type { CommerceOrder } from '~~/shared/types/commerce'

export default defineEventHandler(async (): Promise<CommerceOrder> => {
  // Commerce API (ASP.NET) requires a JSON body even for empty POSTs.
  // Sending no body with Content-Type: application/json triggers HTTP 400.
  return commerceFetch<CommerceOrder>('/orders', { method: 'POST', body: {} })
})
