<script setup lang="ts">
const cart = useCartStore()
const { formatPrice } = useFormatPrice()

const step = ref<'shipping' | 'logistics' | 'payment' | 'confirmation'>('shipping')

const shipping = reactive({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
})

const logistics = reactive({
  method: 'standard',
})

const shippingCost = computed(() => {
  if (logistics.method === 'express') return 19.99
  if (logistics.method === 'overnight') return 39.99
  return 0
})

const total = computed(() => cart.subtotal + shippingCost.value)

const steps = ['shipping', 'logistics', 'payment', 'confirmation'] as const

const currentStepIndex = computed(() => steps.indexOf(step.value))

function nextStep() {
  const idx = currentStepIndex.value
  if (idx < steps.length - 1) {
    step.value = steps[idx + 1]
  }
}

function prevStep() {
  const idx = currentStepIndex.value
  if (idx > 0) {
    step.value = steps[idx - 1]
  }
}

function placeOrder() {
  step.value = 'confirmation'
  cart.clearCart()
}

useHead({ title: 'Checkout - Aurora Arc' })
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-white mb-8">Checkout</h1>

      <!-- Empty cart redirect -->
      <div v-if="cart.items.length === 0 && step !== 'confirmation'" class="text-center py-20">
        <p class="text-glacier/40 text-lg mb-4">Your cart is empty</p>
        <ArcButton variant="primary" to="/shop">Browse Shop</ArcButton>
      </div>

      <div v-else class="grid lg:grid-cols-[1fr_340px] gap-8">
        <!-- Main content -->
        <div>
          <!-- Progress bar -->
          <div v-if="step !== 'confirmation'" class="flex items-center gap-2 mb-8">
            <template v-for="(s, i) in steps.slice(0, 3)" :key="s">
              <div
                :class="[
                  'flex items-center gap-2 text-sm font-medium transition-colors',
                  i <= currentStepIndex ? 'text-teal' : 'text-glacier/30',
                ]"
              >
                <div
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all',
                    i <= currentStepIndex
                      ? 'bg-teal/15 border-teal text-teal'
                      : 'border-midnight-lighter text-glacier/30',
                  ]"
                >
                  {{ i + 1 }}
                </div>
                <span class="hidden sm:inline capitalize">{{ s }}</span>
              </div>
              <div
                v-if="i < 2"
                :class="['flex-1 h-px', i < currentStepIndex ? 'bg-teal/30' : 'bg-midnight-lighter']"
              />
            </template>
          </div>

          <!-- Step: Shipping -->
          <div v-if="step === 'shipping'" class="glass rounded-xl p-6 sm:p-8 space-y-5">
            <h2 class="text-xl font-semibold text-white">Shipping Information</h2>

            <div class="grid sm:grid-cols-2 gap-4">
              <ArcInput v-model="shipping.firstName" label="First Name" required />
              <ArcInput v-model="shipping.lastName" label="Last Name" required />
            </div>
            <ArcInput v-model="shipping.email" label="Email" type="email" required />
            <ArcInput v-model="shipping.address" label="Address" required />
            <div class="grid sm:grid-cols-3 gap-4">
              <ArcInput v-model="shipping.city" label="City" required />
              <ArcInput v-model="shipping.state" label="State" required />
              <ArcInput v-model="shipping.zip" label="ZIP Code" required />
            </div>

            <div class="flex justify-end pt-2">
              <ArcButton variant="primary" @click="nextStep">
                Continue to Logistics
              </ArcButton>
            </div>
          </div>

          <!-- Step: Logistics -->
          <div v-if="step === 'logistics'" class="glass rounded-xl p-6 sm:p-8 space-y-5">
            <h2 class="text-xl font-semibold text-white">Shipping Method</h2>

            <div class="space-y-3">
              <label
                v-for="opt in [
                  { id: 'standard', label: 'Standard Shipping', desc: '5-7 business days', price: 'Free' },
                  { id: 'express', label: 'Express Shipping', desc: '2-3 business days', price: '$19.99' },
                  { id: 'overnight', label: 'Overnight Shipping', desc: 'Next business day', price: '$39.99' },
                ]"
                :key="opt.id"
                :class="[
                  'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all',
                  logistics.method === opt.id
                    ? 'glass-light border-teal/30 glow-teal'
                    : 'glass border-transparent hover:border-midnight-lighter',
                ]"
              >
                <div class="flex items-center gap-3">
                  <input
                    v-model="logistics.method"
                    type="radio"
                    name="shipping"
                    :value="opt.id"
                    class="accent-teal"
                  />
                  <div>
                    <p class="text-sm font-medium text-white">{{ opt.label }}</p>
                    <p class="text-xs text-glacier/40">{{ opt.desc }}</p>
                  </div>
                </div>
                <span :class="opt.id === 'standard' ? 'text-teal text-sm font-medium' : 'text-sm text-glacier/60'">
                  {{ opt.price }}
                </span>
              </label>
            </div>

            <div class="flex justify-between pt-2">
              <ArcButton variant="secondary" @click="prevStep">Back</ArcButton>
              <ArcButton variant="primary" @click="nextStep">
                Continue to Payment
              </ArcButton>
            </div>
          </div>

          <!-- Step: Payment -->
          <div v-if="step === 'payment'" class="glass rounded-xl p-6 sm:p-8 space-y-5">
            <h2 class="text-xl font-semibold text-white">Payment</h2>

            <div class="glass-light rounded-lg p-6 text-center space-y-3">
              <div class="w-12 h-12 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center mx-auto">
                <svg class="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p class="text-sm text-glacier/60">This is a demo store. No real payment is processed.</p>
              <p class="text-xs text-glacier/40">Click "Place Order" to simulate a purchase.</p>
            </div>

            <div class="flex justify-between pt-2">
              <ArcButton variant="secondary" @click="prevStep">Back</ArcButton>
              <ArcButton variant="accent" @click="placeOrder">
                Place Order - {{ formatPrice(total) }}
              </ArcButton>
            </div>
          </div>

          <!-- Step: Confirmation -->
          <div v-if="step === 'confirmation'" class="glass rounded-xl p-8 sm:p-12 text-center space-y-6">
            <div class="w-20 h-20 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center mx-auto">
              <svg class="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white">Order Confirmed!</h2>
            <p class="text-glacier/60 max-w-md mx-auto">
              Thank you for your demo order. In a real store, you'd receive a confirmation email at {{ shipping.email || 'your email address' }}.
            </p>
            <p class="text-xs text-glacier/30">
              Order #ARC-{{ Math.random().toString(36).substring(2, 8).toUpperCase() }}
            </p>
            <ArcButton variant="primary" to="/">
              Continue Exploring
            </ArcButton>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <aside v-if="step !== 'confirmation' && cart.items.length > 0" class="space-y-4">
          <div class="glass rounded-xl p-6 sticky top-24">
            <h3 class="text-sm font-semibold text-white mb-4">Order Summary</h3>

            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="item in cart.items"
                :key="item.product.sku"
                class="flex gap-3"
              >
                <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <ProductPlaceholderSvg :category="item.product.category" :color="item.product.accentColor" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-white truncate">{{ item.product.name }}</p>
                  <p class="text-xs text-glacier/40">Qty: {{ item.quantity }}</p>
                </div>
                <span class="text-sm text-glacier/70 flex-shrink-0">{{ formatPrice(item.product.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="border-t border-midnight-lighter mt-4 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-glacier/50">Subtotal</span>
                <span class="text-glacier">{{ formatPrice(cart.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-glacier/50">Shipping</span>
                <span :class="shippingCost === 0 ? 'text-teal' : 'text-glacier'">
                  {{ shippingCost === 0 ? 'Free' : formatPrice(shippingCost) }}
                </span>
              </div>
              <div class="flex justify-between text-sm font-semibold border-t border-midnight-lighter pt-2">
                <span class="text-white">Total</span>
                <span class="text-white">{{ formatPrice(total) }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
