<script setup lang="ts">
const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Shop All', to: '/shop' },
      { label: 'Navigation Gear', to: '/category/navigation-gear' },
      { label: 'Wearable Tech', to: '/category/wearable-tech' },
      { label: 'Expedition Equipment', to: '/category/expedition-equipment' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', to: '#' },
      { label: 'Field Journal', to: '#' },
      { label: 'Sustainability', to: '#' },
      { label: 'Careers', to: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', to: '#' },
      { label: 'Shipping & Returns', to: '#' },
      { label: 'Warranty', to: '#' },
      { label: 'FAQ', to: '#' },
    ],
  },
]
</script>

<template>
  <footer class="border-t border-midnight-lighter bg-midnight/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Brand column -->
        <div class="col-span-2 md:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-teal/15 border border-teal/25 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-5 h-5 text-teal" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 19h20L12 2z" />
                <path d="M12 8v6" />
              </svg>
            </div>
            <span class="text-lg font-bold text-white tracking-tight">Aurora<span class="text-teal">Arc</span></span>
          </NuxtLink>
          <p class="text-sm text-glacier/50 leading-relaxed">
            Precision expedition gear fusing cutting-edge tech with rugged field performance.
          </p>
        </div>

        <!-- Link columns -->
        <div v-for="col in columns" :key="col.title">
          <h3 class="text-sm font-semibold text-white mb-4">{{ col.title }}</h3>
          <ul class="space-y-2.5">
            <li v-for="link in col.links" :key="link.label">
              <NuxtLink :to="link.to" class="text-sm text-glacier/50 hover:text-teal transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 pt-8 border-t border-midnight-lighter flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-xs text-glacier/30">&copy; {{ new Date().getFullYear() }} Aurora Arc. All rights reserved.</p>
        <p class="text-xs text-glacier/30">This is a demo storefront.</p>
      </div>
    </div>
  </footer>
</template>
