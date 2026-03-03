<script setup lang="ts">
import type { Product } from '~~/shared/types/product'

const props = defineProps<{
  product: Product
}>()

const cart = useCart()
const { formatPrice } = useFormatPrice()
</script>

<template>
  <ArcCard :glow="product.accentColor">
    <NuxtLink :to="`/product/${product.slug}`" class="block group">
      <!-- Image -->
      <div class="aspect-square relative overflow-hidden">
        <img
          v-if="product.heroImageUrl"
          :src="product.heroImageUrl"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <ProductPlaceholderSvg v-else :category="product.category" :color="product.accentColor" />
        <!-- Hover overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <!-- Sale badge -->
        <div v-if="product.compareAtPrice" class="absolute top-3 right-3">
          <span class="bg-coral text-white text-xs font-bold px-2 py-1 rounded-md">
            -{{ Math.round((1 - product.price / product.compareAtPrice) * 100) }}%
          </span>
        </div>
      </div>
    </NuxtLink>

    <!-- Info -->
    <div class="p-4 space-y-3 border-t border-white/5">
      <NuxtLink :to="`/product/${product.slug}`">
        <h3 class="font-semibold text-white text-sm leading-tight hover:text-teal transition-colors">
          {{ product.name }}
        </h3>
        <p class="text-xs text-glacier/50 mt-1 line-clamp-1">{{ product.tagline }}</p>
      </NuxtLink>

      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-bold text-white">{{ formatPrice(product.price) }}</span>
          <span v-if="product.compareAtPrice" class="text-sm text-glacier/40 line-through">
            {{ formatPrice(product.compareAtPrice) }}
          </span>
        </div>
      </div>

      <ArcButton
        variant="secondary"
        size="sm"
        class="w-full"
        @click.prevent="cart.addItem(product)"
      >
        Add to Cart
      </ArcButton>
    </div>
  </ArcCard>
</template>
