<script setup lang="ts">
import { categoryLabels, techLevelLabels, activityLabels } from '~~/shared/types/product'
import type { ProductCategory } from '~~/shared/types/product'

const route = useRoute()
const cart = useCart()
const { formatPrice } = useFormatPrice()

const { data: product, error } = useProduct(route.params.sku as string)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

useHead({
  title: () => product.value ? `${product.value.name} - Aurora Arc` : 'Product - Aurora Arc',
})

const quantity = ref(1)

function addToCart() {
  if (product.value) {
    cart.addItem(product.value, quantity.value)
  }
}

const techColor: Record<string, string> = {
  'analog': 'glacier',
  'smart-hybrid': 'teal',
  'full-digital': 'violet',
  'ai-powered': 'coral',
}
</script>

<template>
  <div v-if="product" class="min-h-screen">
    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center gap-2 text-sm text-glacier/40">
        <NuxtLink to="/shop" class="hover:text-teal transition-colors">Shop</NuxtLink>
        <span>/</span>
        <NuxtLink
          :to="`/category/${product.category}`"
          class="hover:text-teal transition-colors"
        >
          {{ categoryLabels[product.category as ProductCategory] }}
        </NuxtLink>
        <span>/</span>
        <span class="text-glacier/70">{{ product.name }}</span>
      </div>
    </div>

    <!-- Hero section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="grid lg:grid-cols-2 gap-10">
        <!-- Image -->
        <div class="glass rounded-2xl overflow-hidden aspect-square">
          <img
            v-if="product.heroImageUrl"
            :src="product.heroImageUrl"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <ProductPlaceholderSvg v-else :category="product.category" :color="product.accentColor" />
        </div>

        <!-- Info -->
        <div class="space-y-6">
          <!-- Badges -->
          <div class="flex flex-wrap gap-2">
            <ArcBadge v-if="product.limitedDrop" color="coral">Limited Drop</ArcBadge>
            <ArcBadge :color="(techColor[product.techLevel] as any)">
              {{ techLevelLabels[product.techLevel] }}
            </ArcBadge>
            <ArcBadge
              v-for="activity in product.activities"
              :key="activity"
              color="glacier"
            >
              {{ activityLabels[activity] }}
            </ArcBadge>
          </div>

          <!-- Name & tagline -->
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">{{ product.name }}</h1>
            <p class="text-lg text-glacier/50 mt-2">{{ product.tagline }}</p>
          </div>

          <!-- Price -->
          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-bold text-white">{{ formatPrice(product.price) }}</span>
            <span v-if="product.compareAtPrice" class="text-lg text-glacier/40 line-through">
              {{ formatPrice(product.compareAtPrice) }}
            </span>
            <ArcBadge v-if="product.compareAtPrice" color="coral">
              Save {{ formatPrice(product.compareAtPrice - product.price) }}
            </ArcBadge>
          </div>

          <!-- Description -->
          <p class="text-glacier/70 leading-relaxed">{{ product.description }}</p>

          <!-- Add to cart -->
          <div class="flex items-center gap-4">
            <div class="flex items-center glass rounded-lg">
              <button
                class="px-4 py-3 text-glacier/50 hover:text-white transition-colors"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                -
              </button>
              <span class="w-10 text-center text-white font-medium">{{ quantity }}</span>
              <button
                class="px-4 py-3 text-glacier/50 hover:text-white transition-colors"
                @click="quantity++"
              >
                +
              </button>
            </div>
            <ArcButton
              variant="primary"
              size="lg"
              class="flex-1"
              :disabled="!product.inStock"
              @click="addToCart"
            >
              {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
            </ArcButton>
          </div>

          <!-- Stock status -->
          <div class="flex items-center gap-2 text-sm">
            <div :class="['w-2 h-2 rounded-full', product.inStock ? 'bg-teal' : 'bg-coral']" />
            <span :class="product.inStock ? 'text-teal' : 'text-coral'">
              {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>

          <!-- SKU -->
          <p class="text-xs text-glacier/30">SKU: {{ product.sku }}</p>
        </div>
      </div>
    </div>

    <!-- Specs & Story -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div class="grid lg:grid-cols-2 gap-6">
        <ProductHudSpecs :specs="product.techSpecs" :color="product.accentColor" />
        <ProductStory :excerpt="product.storyExcerpt" :full="product.storyFull" />
      </div>
    </div>
  </div>
</template>
