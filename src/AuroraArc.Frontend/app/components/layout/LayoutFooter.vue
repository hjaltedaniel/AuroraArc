<script setup lang="ts">
const { data: settings } = await useSiteSettings()

const columns = computed(() =>
  settings.value.footerColumns.map(col => ({
    title: col.title,
    links: col.links.map(l => ({ label: l.label, to: l.url })),
  }))
)
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
            <span class="text-lg font-bold text-white tracking-tight">{{ settings.logoText }}<span class="text-teal">{{ settings.logoHighlight }}</span></span>
          </NuxtLink>
          <p class="text-sm text-glacier/50 leading-relaxed">
            {{ settings.footerBrandDescription }}
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
        <p class="text-xs text-glacier/30">{{ settings.copyrightText }}</p>
        <p class="text-xs text-glacier/30">{{ settings.bottomNotice }}</p>
      </div>
    </div>
  </footer>
</template>
