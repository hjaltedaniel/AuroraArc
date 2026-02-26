<script setup lang="ts">
import type { Product } from '~~/shared/types/product'
import { techLevelLabels } from '~~/shared/types/product'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()
const { formatPrice } = useFormatPrice()

const techColor: Record<string, 'teal' | 'violet' | 'coral' | 'glacier'> = {
  'analog': 'glacier',
  'smart-hybrid': 'teal',
  'full-digital': 'violet',
  'ai-powered': 'coral',
}
</script>

<template>
  <ArcCard :glow="product.accentColor">
    <NuxtLink :to="`/product/${product.slug}`" class="block">
      <!-- Image -->
      <div class="aspect-square relative overflow-hidden">
        <ProductPlaceholderSvg :category="product.category" :color="product.accentColor" />

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
          <ArcBadge v-if="product.limitedDrop" color="coral">Limited Drop</ArcBadge>
          <ArcBadge :color="techColor[product.techLevel]">
            {{ techLevelLabels[product.techLevel] }}
          </ArcBadge>
        </div>

        <!-- Sale badge -->
        <div v-if="product.compareAtPrice" class="absolute top-3 right-3">
          <span class="bg-coral text-white text-xs font-bold px-2 py-1 rounded-md">
            -{{ Math.round((1 - product.price / product.compareAtPrice) * 100) }}%
          </span>
        </div>
      </div>
    </NuxtLink>

    <!-- Info -->
    <div class="p-4 space-y-3">
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
        :disabled="!product.inStock"
        @click.prevent="cart.addItem(product)"
      >
        {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
      </ArcButton>
    </div>
  </ArcCard>
</template>
