<script setup lang="ts">
import { algoliasearch } from 'algoliasearch'
import {
  AisInstantSearch,
  AisSearchBox,
  AisHits,
  AisRefinementList,
  AisRangeInput,
  AisToggleRefinement,
  AisPanel,
  AisClearRefinements,
  AisSortBy,
  AisStats,
  AisDynamicWidgets,
} from 'vue-instantsearch/vue3/es'

const rawClient = algoliasearch('R55NZS8KGD', '622e4e9e66d9bf9a8c9b2cd3462919c6')

const searchClient = {
  ...rawClient,
  search(requests: any) {
    return rawClient.search(requests)
  },
}

const showMobileFilters = ref(false)

// Compute the gradient % positions for the dual range track
function trackStyle(min: number, max: number, currentMin: number | undefined, currentMax: number | undefined) {
  const lo = ((( currentMin ?? min) - min) / (max - min)) * 100
  const hi = (((currentMax ?? max) - min) / (max - min)) * 100
  return `background: linear-gradient(to right, #334155 ${lo}%, #2dd4bf ${lo}%, #2dd4bf ${hi}%, #334155 ${hi}%)`
}
</script>

<template>
  <div class="min-h-screen">
    <ais-instant-search :search-client="searchClient" index-name="AuroraArc">

      <!-- Page header -->
      <div class="border-b border-midnight-lighter">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-white">
            All <span class="text-gradient-teal">Gear</span>
          </h1>
          <p class="text-glacier/35 text-sm mt-1 tracking-wide">Precision expedition equipment for the connected explorer</p>
          <ais-stats class="text-glacier/50 mt-2">
            <template v-slot="{ nbHits }">
              <p>{{ nbHits }} products</p>
            </template>
          </ais-stats>
          <div class="mt-4 max-w-xl">
            <ais-search-box placeholder="Search gear..." />
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">

          <!-- Mobile filter toggle -->
          <button
            class="lg:hidden w-full glass rounded-lg px-4 py-3 text-sm text-glacier/70 flex items-center justify-between mb-6 border border-white/5 hover:border-teal/20 transition-colors duration-200 active:scale-[0.99]"
            @click="showMobileFilters = !showMobileFilters"
          >
            <span class="font-medium tracking-wide">Filters</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </button>

          <!-- Sidebar filters -->
          <aside :class="['space-y-4 sticky top-6 self-start', showMobileFilters ? 'block' : 'hidden lg:block']">

            <!-- Dynamic facets — visibility controlled via Algolia dashboard Facet Display -->
            <ais-dynamic-widgets>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Price</h3></template>
                <ais-range-input attribute="basePrice">
                  <template v-slot="{ currentRefinement, range, refine }">
                    <div class="space-y-3">
                      <div class="relative h-5">
                        <div class="range-track" :style="trackStyle(range.min, range.max, currentRefinement.min, currentRefinement.max)" />
                        <!-- Min handle -->
                        <input
                          type="range"
                          :min="range.min"
                          :max="range.max"
                          :value="currentRefinement.min ?? range.min"
                          class="dual-range w-full absolute"
                          @input="refine({ min: Number(($event.target as HTMLInputElement).value), max: currentRefinement.max ?? range.max })"
                        />
                        <!-- Max handle -->
                        <input
                          type="range"
                          :min="range.min"
                          :max="range.max"
                          :value="currentRefinement.max ?? range.max"
                          class="dual-range w-full absolute"
                          @input="refine({ min: currentRefinement.min ?? range.min, max: Number(($event.target as HTMLInputElement).value) })"
                        />
                      </div>
                      <div class="flex justify-between text-xs text-glacier/50">
                        <span>${{ currentRefinement.min ?? range.min }}</span>
                        <span>${{ currentRefinement.max ?? range.max }}</span>
                      </div>
                    </div>
                  </template>
                </ais-range-input>
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Power Source</h3></template>
                <ais-refinement-list attribute="powerSource" class="algolia-refinement" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Battery Life</h3></template>
                <ais-refinement-list attribute="batteryLife" class="algolia-refinement" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Materials</h3></template>
                <ais-refinement-list attribute="materials" class="algolia-refinement" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">On Sale</h3></template>
                <ais-toggle-refinement attribute="isOnSale" label="On Sale Only" class="algolia-toggle" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Sustainable</h3></template>
                <ais-toggle-refinement attribute="isSustainable" label="Sustainable Only" class="algolia-toggle" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Weight (g)</h3></template>
                <ais-refinement-list attribute="Weight" class="algolia-refinement" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Color</h3></template>
                <ais-refinement-list attribute="Color" class="algolia-refinement" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Battery (h)</h3></template>
                <ais-refinement-list attribute="Battery" class="algolia-refinement" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Brand</h3></template>
                <ais-refinement-list attribute="Brand" class="algolia-refinement" />
              </ais-panel>

              <ais-panel class="glass rounded-xl p-5">
                <template #header><h3 class="text-sm font-semibold text-white mb-3">Tags</h3></template>
                <ais-refinement-list attribute="tags" class="algolia-refinement" />
              </ais-panel>

              <!-- Add any new facets here as you create them in Algolia -->

            </ais-dynamic-widgets>

            <ais-clear-refinements>
              <template #resetLabel>
                <span class="text-sm text-coral hover:text-coral-dim transition-colors">Clear all filters</span>
              </template>
            </ais-clear-refinements>

            <!-- Sort -->
            <div class="glass rounded-xl p-5">
              <h3 class="text-sm font-semibold text-white mb-3">Sort by</h3>
              <ais-sort-by
                :items="[
                  { value: 'AuroraArc', label: 'Featured' },
                  { value: 'AuroraArc_price_asc', label: 'Price: Low to High' },
                  { value: 'AuroraArc_price_desc', label: 'Price: High to Low' },
                  { value: 'AuroraArc_name_asc', label: 'Name A-Z' },
                ]"
                class="w-full bg-midnight-light border border-midnight-lighter text-glacier text-sm rounded-lg px-3 py-2 focus:border-teal/30 focus:outline-none"
              />
            </div>

          </aside>

          <!-- Product grid -->
          <ais-hits>
            <template #default="{ items, sendEvent }">
              <div v-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                  v-for="item in items"
                  :key="item.sku"
                  :product="{ ...item, slug: item.route?.split('/').filter(Boolean).pop(), price: item.basePrice, compareAtPrice: item.salePrice || null }"
                  @click="sendEvent('click', item, 'Product Clicked')"
                />
              </div>
              <div v-else class="text-center py-24 space-y-4">
                <div class="w-16 h-16 rounded-full glass border border-white/5 flex items-center justify-center mx-auto">
                  <svg class="w-7 h-7 text-glacier/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <p class="text-glacier/40 text-lg font-medium">No products found</p>
                <p class="text-glacier/25 text-sm">Try adjusting or clearing your filters</p>
              </div>
            </template>
          </ais-hits>

        </div>
      </div>

    </ais-instant-search>
  </div>
</template>

<style>
@import 'instantsearch.css/themes/satellite-min.css';

.algolia-refinement .ais-RefinementList-checkbox {
  accent-color: #2dd4bf;
}
.algolia-refinement .ais-RefinementList-label {
  color: rgb(var(--color-glacier) / 0.6);
  font-size: 0.875rem;
  cursor: pointer;
}
.algolia-refinement .ais-RefinementList-label:hover {
  color: rgb(var(--color-glacier));
}

.algolia-toggle .ais-ToggleRefinement-label {
  color: rgb(var(--color-glacier) / 0.6);
  font-size: 0.875rem;
  cursor: pointer;
}

/* Dual range slider */
.range-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 4px;
  border-radius: 2px;
  pointer-events: none;
}

.dual-range {
  position: absolute;
  width: 100%;
  height: 4px;
  background: transparent;
  pointer-events: none;
  appearance: none;
  -webkit-appearance: none;
}
.dual-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2dd4bf;
  pointer-events: all;
  cursor: pointer;
  border: 2px solid #0f172a;
}
.dual-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2dd4bf;
  pointer-events: all;
  cursor: pointer;
  border: 2px solid #0f172a;
  box-sizing: border-box;
}
.dual-range::-webkit-slider-runnable-track {
  background: transparent;
}
.dual-range::-moz-range-track {
  background: transparent;
}

.ais-SortBy-select {
  width: 100%;
  background: var(--color-midnight-light);
  border: 1px solid var(--color-midnight-lighter);
  color: rgb(var(--color-glacier));
  font-size: 0.875rem;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
}

/* Search box — override satellite theme for dark UI */
.ais-SearchBox-form {
  background: transparent !important;
  box-shadow: none !important;
}
.ais-SearchBox-input {
  background: var(--color-midnight-light) !important;
  border: 1px solid var(--color-midnight-lighter) !important;
  color: rgb(var(--color-glacier)) !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}
.ais-SearchBox-input:focus {
  border-color: rgba(45, 212, 191, 0.35) !important;
  box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.08) !important;
  outline: none !important;
}
.ais-SearchBox-input::placeholder {
  color: rgb(var(--color-glacier) / 0.3) !important;
}
.ais-SearchBox-submit,
.ais-SearchBox-reset {
  color: rgb(var(--color-glacier) / 0.35) !important;
}
.ais-SearchBox-submit:hover,
.ais-SearchBox-reset:hover {
  color: rgb(var(--color-glacier) / 0.7) !important;
}
</style>