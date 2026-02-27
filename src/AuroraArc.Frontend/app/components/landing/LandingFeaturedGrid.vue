<script setup lang="ts">
const { data: home } = await useCmsHome()
const fg = computed(() => home.value.featuredGrid)

const { data: products } = await useProducts({ featured: true })
</script>

<template>
  <section id="featured" class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-end justify-between mb-10">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-white">
            {{ fg.titleBefore }} <span class="text-gradient-teal">{{ fg.titleHighlight }}</span>
          </h2>
          <p class="text-glacier/50 mt-2">{{ fg.subtitle }}</p>
        </div>
        <ArcButton variant="secondary" size="sm" :to="fg.viewAllUrl" class="hidden sm:flex">
          {{ fg.viewAllText }}
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
        <ArcButton variant="secondary" size="md" :to="fg.viewAllUrl">
          {{ fg.viewAllText }}
        </ArcButton>
      </div>
    </div>
  </section>
</template>
