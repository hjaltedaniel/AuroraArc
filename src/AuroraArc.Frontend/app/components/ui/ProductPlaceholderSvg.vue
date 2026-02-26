<script setup lang="ts">
import type { BrandColor, ProductCategory } from '~~/shared/types/product'

const props = withDefaults(defineProps<{
  category?: ProductCategory
  color?: BrandColor
}>(), {
  category: 'navigation-gear',
  color: 'teal',
})

const colorMap: Record<BrandColor, string> = {
  teal: '#00E5C8',
  coral: '#FF6B4A',
  violet: '#A78BFA',
  glacier: '#B4E0F7',
}

const iconPaths: Record<ProductCategory, string> = {
  'navigation-gear': 'M12 2L2 22h20L12 2zm0 5l6.5 13h-13L12 7z', // compass
  'wearable-tech': 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 2v5l3 3', // watch
  'expedition-equipment': 'M4 20h16L12 4 4 20zm2-2l6-12 6 12H6z', // mountain
  'shelter-camp': 'M3 21V9l9-7 9 7v12H3zm4-2h10V10l-5-3.9L7 10v9z', // tent
  'illumination': 'M12 2a7 7 0 00-4 12.7V18a2 2 0 004 0v-3.3A7 7 0 0012 2zm0 3a4 4 0 012.5 7.1L14 13h-4l-.5-.9A4 4 0 0112 5z', // bulb
}

const fillColor = computed(() => colorMap[props.color])
const iconPath = computed(() => iconPaths[props.category])
</script>

<template>
  <svg
    viewBox="0 0 400 400"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-full"
  >
    <defs>
      <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" :stop-color="fillColor" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#0B1026" stop-opacity="0" />
      </radialGradient>
      <linearGradient :id="`icon-grad-${color}`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="fillColor" stop-opacity="0.9" />
        <stop offset="100%" :stop-color="fillColor" stop-opacity="0.4" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="400" height="400" fill="#0B1026" />
    <rect width="400" height="400" fill="url(#bg-glow)" />

    <!-- Grid lines -->
    <g stroke-width="0.5" :stroke="fillColor" stroke-opacity="0.06">
      <line v-for="i in 7" :key="`h${i}`" x1="0" :y1="i * 50" x2="400" :y2="i * 50" />
      <line v-for="i in 7" :key="`v${i}`" :x1="i * 50" y1="0" :x2="i * 50" y2="400" />
    </g>

    <!-- Center icon -->
    <g transform="translate(152, 152) scale(4)">
      <path
        :d="iconPath"
        :fill="`url(#icon-grad-${color})`"
        stroke="none"
      />
    </g>

    <!-- Corner accents -->
    <line x1="20" y1="20" x2="60" y2="20" :stroke="fillColor" stroke-opacity="0.3" stroke-width="1" />
    <line x1="20" y1="20" x2="20" y2="60" :stroke="fillColor" stroke-opacity="0.3" stroke-width="1" />
    <line x1="380" y1="380" x2="340" y2="380" :stroke="fillColor" stroke-opacity="0.3" stroke-width="1" />
    <line x1="380" y1="380" x2="380" y2="340" :stroke="fillColor" stroke-opacity="0.3" stroke-width="1" />
  </svg>
</template>
