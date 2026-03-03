<script setup lang="ts">
const { data: settings } = await useSiteSettings()
const cart = useCartStore()
const mobileOpen = ref(false)

const navLinks = computed(() =>
  settings.value.headerNavLinks.map(l => ({ label: l.label, to: l.url }))
)
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-lg bg-teal/15 border border-teal/25 flex items-center justify-center transition-all group-hover:glow-teal">
            <svg viewBox="0 0 24 24" class="w-5 h-5 text-teal" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 19h20L12 2z" />
              <path d="M12 8v6" />
            </svg>
          </div>
          <span class="text-lg font-bold text-white tracking-tight">{{ settings.logoText }}<span class="text-teal">{{ settings.logoHighlight }}</span></span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm text-glacier/70 hover:text-teal transition-colors"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <!-- Search -->
          <NuxtLink
            to="/search"
            class="p-2 text-glacier/70 hover:text-teal transition-colors"
            aria-label="Search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 12.15 12.15z" />
            </svg>
          </NuxtLink>

          <!-- Cart -->
          <button
            class="relative p-2 text-glacier/70 hover:text-teal transition-colors"
            aria-label="Open cart"
            @click="cart.toggleDrawer()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <span
              v-if="cart.totalItems > 0"
              class="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            >
              {{ cart.totalItems }}
            </span>
          </button>

          <!-- Mobile hamburger -->
          <button
            class="md:hidden p-2 text-glacier/70 hover:text-teal transition-colors"
            aria-label="Toggle menu"
            @click="mobileOpen = !mobileOpen"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Nav -->
    <LayoutMobileNav v-model:open="mobileOpen" :links="navLinks" />
  </header>
</template>
