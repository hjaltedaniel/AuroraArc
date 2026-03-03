/**
 * cart.client.ts – client-only plugin that rehydrates the Pinia cart from
 * the persisted Commerce order (arc_order_id cookie) on every page load.
 *
 * The `.client.ts` suffix means Nuxt never runs this on the server, so
 * $fetch and cookies are always available in browser context.
 */
export default defineNuxtPlugin(async () => {
  const cart = useCart()
  await cart.initCart()
})
