<script setup lang="ts">
const cart = reactive(useCart())
const { formatPrice } = useFormatPrice()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
})

const submitting = ref(false)
const checkoutError = ref<string | null>(null)

const isFormValid = computed(
  () => form.firstName.trim() && form.lastName.trim() && form.email.trim(),
)

async function startCheckout() {
  if (!isFormValid.value) return

  submitting.value = true
  checkoutError.value = null

  try {
    await cart.updateCustomerInfo({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
    })

    const redirectUrl = await cart.getCheckoutToken()
    await navigateTo(redirectUrl, { external: true })
  } catch (err: unknown) {
    checkoutError.value =
      err instanceof Error ? err.message : 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Checkout - Aurora Arc' })
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-white mb-8">Checkout</h1>

      <!-- Empty cart -->
      <div v-if="cart.items.length === 0" class="text-center py-20">
        <p class="text-glacier/40 text-lg mb-4">Your cart is empty</p>
        <ArcButton variant="primary" to="/shop">Browse Shop</ArcButton>
      </div>

      <div v-else class="grid lg:grid-cols-[1fr_340px] gap-8">
        <!-- Contact form -->
        <div class="glass rounded-xl p-6 sm:p-8 space-y-5">
          <h2 class="text-xl font-semibold text-white">Contact Information</h2>
          <p class="text-sm text-glacier/50">
            Enter your details below. You'll be redirected to Stripe to complete payment securely.
          </p>

          <div class="grid sm:grid-cols-2 gap-4">
            <ArcInput v-model="form.firstName" label="First Name" required />
            <ArcInput v-model="form.lastName" label="Last Name" required />
          </div>
          <ArcInput v-model="form.email" label="Email" type="email" required />

          <!-- Error -->
          <div
            v-if="checkoutError"
            class="flex items-start gap-3 p-4 rounded-lg bg-coral/10 border border-coral/20"
          >
            <svg
              class="w-5 h-5 text-coral flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p class="text-sm text-coral">{{ checkoutError }}</p>
          </div>

          <div class="flex justify-end pt-2">
            <ArcButton
              variant="accent"
              :disabled="!isFormValid || submitting"
              @click="startCheckout"
            >
              <span v-if="submitting" class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Redirecting to Stripe…
              </span>
              <span v-else>Pay with Stripe — {{ formatPrice(cart.subtotal) }}</span>
            </ArcButton>
          </div>

          <!-- Stripe badge -->
          <div class="flex items-center justify-center gap-2 pt-2">
            <svg
              class="w-4 h-4 text-glacier/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <span class="text-xs text-glacier/30">Secured by Stripe</span>
          </div>
        </div>

        <!-- Order summary sidebar -->
        <aside class="space-y-4">
          <div class="glass rounded-xl p-6 sticky top-24">
            <h3 class="text-sm font-semibold text-white mb-4">Order Summary</h3>

            <div class="space-y-3 max-h-64 overflow-y-auto">
              <template v-for="item in cart.items" :key="item?.product?.sku">
                <div v-if="item && item.product" class="flex gap-3">
                  <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <ProductPlaceholderSvg
                      :category="item.product.category"
                      :color="item.product.accentColor"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-white truncate">{{ item.product.name }}</p>
                    <p class="text-xs text-glacier/40">Qty: {{ item.quantity }}</p>
                  </div>
                  <span class="text-sm text-glacier/70 flex-shrink-0">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </span>
                </div>
              </template>
            </div>

            <div class="border-t border-midnight-lighter mt-4 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-glacier/50">Subtotal</span>
                <span class="text-glacier">{{ formatPrice(cart.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-glacier/50">Shipping</span>
                <span class="text-glacier/40 text-xs italic">calculated at Stripe</span>
              </div>
              <div class="flex justify-between text-sm font-semibold border-t border-midnight-lighter pt-2">
                <span class="text-white">Total</span>
                <span class="text-white">{{ formatPrice(cart.subtotal) }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
