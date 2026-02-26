<script setup lang="ts">
const { data: products } = await useProducts({ featured: true })
</script>

<template>
  <section id="featured" class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-end justify-between mb-10">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-white">
            Featured <span class="text-gradient-teal">Gear</span>
          </h2>
          <p class="text-glacier/50 mt-2">Hand-picked by our expedition team</p>
        </div>
        <ArcButton variant="secondary" size="sm" to="/shop" class="hidden sm:flex">
          View All
        </ArcButton>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.sku"
          :product="product"
        />
      </div>

      <!-- Mobile CTA -->
      <div class="mt-8 text-center sm:hidden">
        <ArcButton variant="secondary" size="md" to="/shop">
          View All Products
        </ArcButton>
      </div>
    </div>
  </section>
</template>
