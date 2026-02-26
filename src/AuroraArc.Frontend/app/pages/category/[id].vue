<script setup lang="ts">
import { categoryLabels } from '~~/shared/types/product'
import type { ProductCategory } from '~~/shared/types/product'

const route = useRoute()
const categoryId = computed(() => route.params.id as string)

const categoryName = computed(() =>
  categoryLabels[categoryId.value as ProductCategory] || categoryId.value,
)

const filters = ref({
  category: categoryId.value,
  sort: 'featured',
})

const { data: products, status } = useProducts(filters)

useHead({
  title: () => `${categoryName.value} - Aurora Arc`,
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Page header -->
    <div class="border-b border-midnight-lighter">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center gap-2 text-sm text-glacier/40 mb-3">
          <NuxtLink to="/shop" class="hover:text-teal transition-colors">Shop</NuxtLink>
          <span>/</span>
          <span class="text-glacier/70">{{ categoryName }}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-white">
          {{ categoryName }}
        </h1>
        <p class="text-glacier/50 mt-2">{{ products?.length || 0 }} products</p>
      </div>
    </div>

    <!-- Sort bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
      <select
        v-model="filters.sort"
        class="bg-midnight-light border border-midnight-lighter text-glacier text-sm rounded-lg px-3 py-2 focus:border-teal/30 focus:outline-none"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>

    <!-- Product grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="glass rounded-xl h-96 animate-pulse" />
      </div>

      <div v-else-if="products && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.sku"
          :product="product"
        />
      </div>

      <div v-else class="text-center py-20">
        <p class="text-glacier/40 text-lg">No products in this category yet</p>
        <ArcButton variant="secondary" size="sm" class="mt-4" to="/shop">
          Browse All Gear
        </ArcButton>
      </div>
    </div>
  </div>
</template>
