<script setup lang="ts">
const cart = useCartStore()
const { formatPrice } = useFormatPrice()
</script>

<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cart.isOpen"
        class="fixed inset-0 bg-black/60 z-[60]"
        @click="cart.closeDrawer()"
      />
    </Transition>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="cart.isOpen"
        class="fixed top-0 right-0 bottom-0 w-full max-w-md glass z-[70] flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-midnight-lighter">
          <h2 class="text-lg font-semibold text-white">
            Cart
            <span v-if="cart.totalItems" class="text-teal">({{ cart.totalItems }})</span>
          </h2>
          <button
            class="p-1.5 text-glacier/50 hover:text-white transition-colors"
            aria-label="Close cart"
            @click="cart.closeDrawer()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div v-if="cart.items.length === 0" class="flex flex-col items-center justify-center h-full text-center">
            <svg class="w-16 h-16 text-midnight-lighter mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <p class="text-glacier/40 text-sm">Your cart is empty</p>
            <ArcButton variant="secondary" size="sm" class="mt-4" to="/shop" @click="cart.closeDrawer()">
              Browse Shop
            </ArcButton>
          </div>

          <!-- Cart Items -->
          <div
            v-for="item in cart.items"
            :key="item.product.sku"
            class="flex gap-4 p-3 rounded-lg bg-midnight-light/50"
          >
            <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <ProductPlaceholderSvg :category="item.product.category" :color="item.product.accentColor" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-white truncate">{{ item.product.name }}</h3>
              <p class="text-sm text-teal mt-0.5">{{ formatPrice(item.product.price) }}</p>
              <div class="flex items-center gap-2 mt-2">
                <button
                  class="w-6 h-6 rounded border border-midnight-lighter text-glacier/50 hover:border-teal/30 hover:text-teal flex items-center justify-center text-xs transition-colors"
                  @click="cart.updateQuantity(item.product.sku, item.quantity - 1)"
                >
                  -
                </button>
                <span class="text-sm text-glacier w-5 text-center">{{ item.quantity }}</span>
                <button
                  class="w-6 h-6 rounded border border-midnight-lighter text-glacier/50 hover:border-teal/30 hover:text-teal flex items-center justify-center text-xs transition-colors"
                  @click="cart.updateQuantity(item.product.sku, item.quantity + 1)"
                >
                  +
                </button>
                <button
                  class="ml-auto text-glacier/30 hover:text-coral transition-colors"
                  @click="cart.removeItem(item.product.sku)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cart.items.length > 0" class="border-t border-midnight-lighter px-6 py-5 space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-glacier/60">Subtotal</span>
            <span class="font-semibold text-white">{{ formatPrice(cart.subtotal) }}</span>
          </div>
          <ArcButton variant="primary" size="lg" class="w-full" to="/checkout" @click="cart.closeDrawer()">
            Checkout
          </ArcButton>
          <button
            class="w-full text-center text-xs text-glacier/40 hover:text-coral transition-colors"
            @click="cart.clearCart()"
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
