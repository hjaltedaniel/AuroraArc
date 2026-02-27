<script setup lang="ts">
import type { BrandColor, ProductCategory } from '~~/shared/types/product'

const { data: home } = await useCmsHome()
const showcase = computed(() => home.value.categoryShowcase)

const categories: { id: ProductCategory; label: string; description: string; color: BrandColor; icon: string }[] = [
  {
    id: 'navigation-gear',
    label: 'Navigation Gear',
    description: 'GPS, compasses, and wayfinding tech',
    color: 'teal',
    icon: 'M12 2L2 22h20L12 2zm0 5l6.5 13h-13L12 7z',
  },
  {
    id: 'wearable-tech',
    label: 'Wearable Tech',
    description: 'Watches, HUDs, and body-worn sensors',
    color: 'violet',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 2v5l3 3',
  },
  {
    id: 'expedition-equipment',
    label: 'Expedition Equipment',
    description: 'Packs, poles, filters, and field tools',
    color: 'coral',
    icon: 'M4 20h16L12 4 4 20zm2-2l6-12 6 12H6z',
  },
  {
    id: 'shelter-camp',
    label: 'Shelter & Camp',
    description: 'Tents, sleep systems, and camp stoves',
    color: 'coral',
    icon: 'M3 21V9l9-7 9 7v12H3zm4-2h10V10l-5-3.9L7 10v9z',
  },
  {
    id: 'illumination',
    label: 'Illumination',
    description: 'Headlamps, lanterns, and trail markers',
    color: 'glacier',
    icon: 'M12 2a7 7 0 00-4 12.7V18a2 2 0 004 0v-3.3A7 7 0 0012 2zm0 3a4 4 0 012.5 7.1L14 13h-4l-.5-.9A4 4 0 0112 5z',
  },
]

const colorMap: Record<BrandColor, string> = {
  teal: '#00E5C8',
  coral: '#FF6B4A',
  violet: '#A78BFA',
  glacier: '#B4E0F7',
}

const hoverClasses: Record<BrandColor, string> = {
  teal: 'hover:border-teal/30 hover:glow-teal',
  coral: 'hover:border-coral/30 hover:glow-coral',
  violet: 'hover:border-violet/30 hover:glow-violet',
  glacier: 'hover:border-glacier/30',
}
</script>

<template>
  <section class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl sm:text-4xl font-bold text-white mb-10">
        {{ showcase.titleBefore }} <span class="text-gradient-teal">{{ showcase.titleHighlight }}</span>
      </h2>

      <!-- Horizontal scroll on mobile, grid on desktop -->
      <div class="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:pb-0 scrollbar-hide">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/category/${cat.id}`"
          :class="[
            'flex-shrink-0 w-56 sm:w-auto glass rounded-xl p-6 transition-all duration-300 group',
            hoverClasses[cat.color],
          ]"
        >
          <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" :style="{ background: `${colorMap[cat.color]}15` }">
            <svg viewBox="0 0 24 24" class="w-5 h-5" :style="{ color: colorMap[cat.color] }" fill="currentColor">
              <path :d="cat.icon" />
            </svg>
          </div>
          <h3 class="font-semibold text-white text-sm group-hover:text-teal transition-colors">{{ cat.label }}</h3>
          <p class="text-xs text-glacier/40 mt-1">{{ cat.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
