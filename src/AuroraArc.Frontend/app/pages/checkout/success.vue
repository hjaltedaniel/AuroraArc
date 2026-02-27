<script setup lang="ts">
const cart = useCart()

onMounted(() => {
  cart.clearCart()
})

useHead({ title: 'Order Confirmed - Aurora Arc' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="glass rounded-2xl p-10 sm:p-16 text-center max-w-lg w-full space-y-6">
      <!-- Success icon -->
      <div
        class="w-20 h-20 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center mx-auto"
      >
        <svg
          class="w-10 h-10 text-teal"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-white">Order Confirmed!</h1>
        <p class="text-glacier/60">
          Thank you for your order. You'll receive a confirmation email shortly.
        </p>
      </div>

      <div class="glass-light rounded-xl p-4 space-y-1 text-sm">
        <p class="text-glacier/50">A receipt has been sent to your email address.</p>
        <p class="text-glacier/40 text-xs mt-2">
          Questions? Contact us at
          <span class="text-teal">support@aurora-arc.com</span>
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <ArcButton variant="primary" to="/shop">
          Continue Shopping
        </ArcButton>
        <ArcButton variant="secondary" to="/">
          Back to Home
        </ArcButton>
      </div>
    </div>
  </div>
</template>
