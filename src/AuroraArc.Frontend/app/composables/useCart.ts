/**
 * useCart – wraps the local Pinia cart store with async Umbraco Commerce sync.
 *
 * Design principles:
 *  • Pinia store is the single source of truth for UI state (optimistic updates).
 *  • Commerce API is synced in the background; errors are surfaced via `syncError`.
 *  • `arc_order_id` cookie (30-day, sameSite: lax) persists the Commerce order ID
 *    across page refreshes so the cart is not lost.
 *  • `cart:lineIds` useState maps sku → Commerce order-line UUID so PATCH/DELETE
 *    calls know which line to target.
 *  • `initCart()` should be called once in a layout/page (e.g. app.vue) to
 *    re-hydrate the cart from Commerce after a page refresh.
 */

import type { Product, CartItem } from '~~/shared/types/product'
import type {
  CommerceOrder,
  CheckoutTokenResponse,
  CommerceCustomerUpdate,
} from '~~/shared/types/commerce'

export function useCart() {
  const store = useCartStore()

  // ----- persistence --------------------------------------------------------

  /** Commerce order ID – lives in a 30-day cookie so it survives page refreshes */
  const orderIdCookie = useCookie<string | null>('arc_order_id', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    default: () => null,
  })

  /**
   * sku → Commerce order-line UUID map.
   * Stored in useState so it is SSR-compatible and survives component unmounts.
   */
  const lineIds = useState<Record<string, string>>('cart:lineIds', () => ({}))

  // ----- reactive status ----------------------------------------------------

  const syncing   = ref(false)
  const syncError = ref<string | null>(null)

  const orderId = computed(() => orderIdCookie.value)

  // ----- private helpers ----------------------------------------------------

  /**
   * Ensures a Commerce order exists.  Creates one if the cookie is absent and
   * returns the order ID.
   */
  async function ensureOrder(): Promise<string> {
    if (orderIdCookie.value) return orderIdCookie.value

    const order = await $fetch<CommerceOrder>('/api/commerce/orders', {
      method: 'POST',
    })
    orderIdCookie.value = order.id
    return order.id
  }

  // ----- public actions -----------------------------------------------------

  /**
   * Re-hydrate cart state from Commerce after a page refresh.
   * Safe to call on SSR (no-ops when cookie absent or fetch fails).
   */
  async function initCart() {
    if (!orderIdCookie.value) return

    try {
      const order = await $fetch<CommerceOrder>(
        `/api/commerce/order/${orderIdCookie.value}`,
      )

      if (order.isFinalized) {
        // Order was completed – start fresh
        orderIdCookie.value = null
        lineIds.value = {}
        return
      }

      // Rebuild lineIds + Pinia items from Commerce order lines
      const newLineIds: Record<string, string> = {}
      const restored: CartItem[] = []

      for (const line of order.orderLines) {
        if (!line.sku) continue

        newLineIds[line.sku] = line.id

        // Build a minimal Product stub for display (no heroImageUrl / techSpecs)
        const stub: Product = {
          sku:           line.sku,
          slug:          line.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name:          line.name,
          tagline:       '',
          description:   '',
          price:         line.unitPrice.value.withoutTax,
          category:      'expedition-equipment',
          activities:    [],
          techLevel:     'analog',
          techSpecs:     [],
          featured:      false,
          limitedDrop:   false,
          accentColor:   'glacier',
          storyExcerpt:  '',
          storyFull:     '',
          inStock:       true,
          contentId:     line.productReference,
        }

        restored.push({ product: stub, quantity: Math.round(line.quantity) })
      }

      lineIds.value = newLineIds
      store.$patch((state) => { state.items = restored })
    }
    catch (e: unknown) {
      console.error('[useCart] initCart failed:', e)

      // Only wipe the cookie when the order definitively no longer exists (HTTP 404).
      // Network errors or 5xx responses are transient – preserve the cookie so the
      // next page-load can retry rather than permanently losing the cart.
      const status =
        (e as { status?: number })?.status ??
        (e as { statusCode?: number })?.statusCode

      if (status === 404) {
        orderIdCookie.value = null
        lineIds.value = {}
      }
    }
  }

  /**
   * Add a product to the cart.  Pinia is updated immediately; Commerce is
   * synced in the background.  If `product.contentId` is missing the
   * Commerce sync is skipped (product was not mapped with the new mapper yet).
   */
  async function addItem(product: Product, quantity = 1) {
    // Optimistic local update
    store.addItem(product, quantity)

    syncing.value   = true
    syncError.value = null

    try {
      const oid      = await ensureOrder()
      const lineId   = lineIds.value[product.sku]
      // Use the accumulated quantity from the store (handles double-add correctly)
      const totalQty = store.items.find(i => i.product.sku === product.sku)?.quantity ?? quantity

      if (lineId) {
        // Line already exists in Commerce – update quantity
        await $fetch<CommerceOrder>(
          `/api/commerce/order/${oid}/item/${lineId}`,
          { method: 'PATCH', body: { quantity: totalQty } },
        )
      }
      else {
        if (!product.contentId) {
          console.warn('[useCart] product.contentId missing for', product.sku, '– Commerce sync skipped')
          return
        }

        // New line – add to Commerce order
        const updated = await $fetch<CommerceOrder>(
          `/api/commerce/order/${oid}`,
          { method: 'POST', body: { productReference: product.contentId, quantity: totalQty } },
        )

        // Capture the new line ID so future PATCH/DELETE know where to go
        const newLine = updated.orderLines.find(l => l.sku === product.sku)
        if (newLine) {
          lineIds.value = { ...lineIds.value, [product.sku]: newLine.id }
        }
      }
    }
    catch (e) {
      syncError.value = 'Could not sync cart with server'
      console.error('[useCart] addItem error', e)
    }
    finally {
      syncing.value = false
    }
  }

  /** Remove a product from the cart. */
  async function removeItem(sku: string) {
    store.removeItem(sku)

    const oid    = orderIdCookie.value
    const lineId = lineIds.value[sku]

    if (!oid || !lineId) return

    syncing.value   = true
    syncError.value = null

    try {
      await $fetch(`/api/commerce/order/${oid}/item/${lineId}`, { method: 'DELETE' })

      // Remove from lineIds map
      const { [sku]: _removed, ...rest } = lineIds.value
      lineIds.value = rest
    }
    catch (e) {
      syncError.value = 'Could not sync cart with server'
      console.error('[useCart] removeItem error', e)
    }
    finally {
      syncing.value = false
    }
  }

  /** Update the quantity of a cart item. Passing 0 or less removes the item. */
  async function updateQuantity(sku: string, quantity: number) {
    if (quantity <= 0) return removeItem(sku)

    store.updateQuantity(sku, quantity)

    const oid    = orderIdCookie.value
    const lineId = lineIds.value[sku]

    if (!oid || !lineId) return

    syncing.value   = true
    syncError.value = null

    try {
      await $fetch(`/api/commerce/order/${oid}/item/${lineId}`, {
        method: 'PATCH',
        body:   { quantity },
      })
    }
    catch (e) {
      syncError.value = 'Could not sync cart with server'
      console.error('[useCart] updateQuantity error', e)
    }
    finally {
      syncing.value = false
    }
  }

  /** Clear the local cart and drop the order cookie (does NOT delete the Commerce order). */
  async function clearCart() {
    store.clearCart()
    lineIds.value       = {}
    orderIdCookie.value = null
  }

  /**
   * Update customer contact info on the Commerce order.
   * Call this before `getCheckoutToken` to attach the buyer's details.
   */
  async function updateCustomerInfo(customer: CommerceCustomerUpdate): Promise<void> {
    const oid = orderIdCookie.value
    if (!oid) throw new Error('[useCart] No active order – add items first')

    await $fetch(`/api/commerce/order/${oid}`, {
      method: 'PATCH',
      body:   { customer },
    })
  }

  /**
   * Set paymentMethod to "stripe" on the order, then retrieve the Stripe
   * hosted-checkout token/session-id.
   * Returns the raw token string; redirect to Stripe using this value.
   */
  async function getCheckoutToken(): Promise<string> {
    const oid = await ensureOrder()

    // Attach Stripe as the payment method
    await $fetch(`/api/commerce/order/${oid}`, {
      method: 'PATCH',
      body:   { paymentMethod: 'stripe' },
    })

    // Fetch the Stripe session token
    const result = await $fetch<CheckoutTokenResponse>(
      `/api/commerce/checkout/${oid}/token`,
    )

    // Commerce may return token, sessionId, or a redirect url
    const token = result.token ?? result.sessionId ?? result.url
    if (!token) throw new Error('[useCart] No checkout token returned from Commerce API')

    return token as string
  }

  // ----- pass-through from Pinia --------------------------------------------

  const items       = computed(() => store.items.filter((i): i is CartItem => i?.product != null))
  const isOpen      = computed(() => store.isOpen)
  const totalItems  = computed(() => store.totalItems)
  const subtotal    = computed(() => store.subtotal)

  const openDrawer  = () => store.openDrawer()
  const closeDrawer = () => store.closeDrawer()
  const toggleDrawer = () => store.toggleDrawer()

  return {
    // State
    items,
    isOpen,
    totalItems,
    subtotal,
    orderId,
    syncing:   readonly(syncing),
    syncError: readonly(syncError),

    // Actions
    initCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    updateCustomerInfo,
    getCheckoutToken,

    // Drawer controls
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }
}
