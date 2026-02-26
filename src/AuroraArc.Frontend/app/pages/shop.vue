<script setup lang="ts">
import { categoryLabels, activityLabels, techLevelLabels } from '~~/shared/types/product'
import type { ProductCategory, Activity, TechLevel } from '~~/shared/types/product'

const route = useRoute()
const router = useRouter()

const filters = ref({
  category: (route.query.category as string) || '',
  activity: (route.query.activity as string) || '',
  techLevel: (route.query.techLevel as string) || '',
  sort: (route.query.sort as string) || 'featured',
})

// Sync URL with filters
watch(filters, (val) => {
  const query: Record<string, string> = {}
  if (val.category) query.category = val.category
  if (val.activity) query.activity = val.activity
  if (val.techLevel) query.techLevel = val.techLevel
  if (val.sort && val.sort !== 'featured') query.sort = val.sort
  router.replace({ query })
}, { deep: true })

const { data: products, status } = useProducts(filters)

const showMobileFilters = ref(false)

function clearFilters() {
  filters.value = { category: '', activity: '', techLevel: '', sort: 'featured' }
}

const hasActiveFilters = computed(() =>
  filters.value.category || filters.value.activity || filters.value.techLevel,
)
</script>

<template>
  <div class="min-h-screen">
    <!-- Page header -->
    <div class="border-b border-midnight-lighter">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-white">
          All <span class="text-gradient-teal">Gear</span>
        </h1>
        <p class="text-glacier/50 mt-2">{{ products?.length || 0 }} products</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        <!-- Mobile filter toggle -->
        <button
          class="lg:hidden w-full glass rounded-lg px-4 py-3 text-sm text-glacier/70 flex items-center justify-between mb-6"
          @click="showMobileFilters = !showMobileFilters"
        >
          <span>Filters {{ hasActiveFilters ? '(active)' : '' }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
        </button>

        <!-- Sidebar filters -->
        <aside :class="['space-y-6', showMobileFilters ? 'block' : 'hidden lg:block']">
          <!-- Category -->
          <div class="glass rounded-xl p-5">
            <h3 class="text-sm font-semibold text-white mb-3">Category</h3>
            <div class="space-y-2">
              <label
                v-for="(label, key) in categoryLabels"
                :key="key"
                class="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  v-model="filters.category"
                  type="radio"
                  name="category"
                  :value="key"
                  class="accent-teal"
                />
                <span class="text-sm text-glacier/60 group-hover:text-glacier transition-colors">{{ label }}</span>
              </label>
            </div>
          </div>

          <!-- Activity -->
          <div class="glass rounded-xl p-5">
            <h3 class="text-sm font-semibold text-white mb-3">Activity</h3>
            <div class="space-y-2">
              <label
                v-for="(label, key) in activityLabels"
                :key="key"
                class="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  v-model="filters.activity"
                  type="radio"
                  name="activity"
                  :value="key"
                  class="accent-teal"
                />
                <span class="text-sm text-glacier/60 group-hover:text-glacier transition-colors">{{ label }}</span>
              </label>
            </div>
          </div>

          <!-- Tech Level -->
          <div class="glass rounded-xl p-5">
            <h3 class="text-sm font-semibold text-white mb-3">Tech Level</h3>
            <div class="space-y-2">
              <label
                v-for="(label, key) in techLevelLabels"
                :key="key"
                class="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  v-model="filters.techLevel"
                  type="radio"
                  name="techLevel"
                  :value="key"
                  class="accent-teal"
                />
                <span class="text-sm text-glacier/60 group-hover:text-glacier transition-colors">{{ label }}</span>
              </label>
            </div>
          </div>

          <!-- Clear -->
          <button
            v-if="hasActiveFilters"
            class="text-sm text-coral hover:text-coral-dim transition-colors"
            @click="clearFilters"
          >
            Clear all filters
          </button>

          <!-- Sort -->
          <div class="glass rounded-xl p-5">
            <h3 class="text-sm font-semibold text-white mb-3">Sort by</h3>
            <select
              v-model="filters.sort"
              class="w-full bg-midnight-light border border-midnight-lighter text-glacier text-sm rounded-lg px-3 py-2 focus:border-teal/30 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </aside>

        <!-- Product grid -->
        <div>
          <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="glass rounded-xl h-96 animate-pulse" />
          </div>

          <div v-else-if="products && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in products"
              :key="product.sku"
              :product="product"
            />
          </div>

          <div v-else class="text-center py-20">
            <p class="text-glacier/40 text-lg">No products match your filters</p>
            <ArcButton variant="secondary" size="sm" class="mt-4" @click="clearFilters">
              Clear Filters
            </ArcButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
