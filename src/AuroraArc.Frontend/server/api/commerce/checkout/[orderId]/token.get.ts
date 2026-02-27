/**
 * GET /api/commerce/checkout/:orderId/token
 * Retrieves the Stripe hosted-checkout redirect URL for the given order.
 *
 * Flow (per Umbraco Commerce Storefront API):
 *  1. GET /checkout/{orderId}/token  → raw GUID token from Commerce API
 *  2. Construct the hosted-checkout pay URL: {base}/checkout/{orderId}/pay/{token}
 *  3. Return { url } so the client can redirect externally via Commerce → Stripe
 *
 * The caller must ensure paymentMethod = "stripe" is set on the order first
 * (via PATCH /api/commerce/order/:orderId).
 */

import type { CheckoutTokenResponse } from '~~/shared/types/commerce'

const FALLBACK_BASE = 'https://dev-aurora-arc.euwest01.umbraco.io/umbraco/commerce/storefront/api/v1'

export default defineEventHandler(async (event): Promise<{ url: string }> => {
  const orderId = getRouterParam(event, 'orderId')
  if (!orderId) throw createError({ statusCode: 400, statusMessage: 'orderId is required' })

  const config = useRuntimeConfig()
  const base = (config.commerceApiBase as string | undefined) || FALLBACK_BASE

  const result = await commerceFetch<CheckoutTokenResponse>(`/checkout/${orderId}/token`)

  const token = result.token ?? result.sessionId
  if (!token) throw createError({ statusCode: 502, statusMessage: 'No checkout token returned from Commerce API' })

  return { url: `${base}/checkout/${orderId}/pay/${token}` }
})
