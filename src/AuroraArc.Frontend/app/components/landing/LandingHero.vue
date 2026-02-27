<script setup lang="ts">
const { data: home } = await useCmsHome()
const hero = computed(() => home.value.hero)
</script>

<template>
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <!-- Background grid -->
    <div class="absolute inset-0 hud-grid-bg" />

    <!-- Gradient overlays -->
    <div class="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight" />
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight to-transparent" />

    <!-- Glow accents -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-[120px]" />
    <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet/5 rounded-full blur-[100px]" />

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
      <!-- Chip -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-xs text-teal mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
        {{ hero.announcementBadge }}
      </div>

      <!-- Headline -->
      <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
        {{ hero.headlineBefore }}
        <span class="text-gradient-teal">{{ hero.headlineHighlight }}</span>
        <br />
        {{ hero.headlineAfter }}
      </h1>

      <!-- Subheading -->
      <p class="mt-6 text-lg sm:text-xl text-glacier/60 max-w-2xl mx-auto leading-relaxed">
        {{ hero.tagline }}
      </p>

      <!-- CTAs -->
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <ArcButton
          v-for="(cta, i) in hero.ctas"
          :key="cta.buttonUrl"
          :variant="i === 0 ? 'primary' : 'secondary'"
          size="lg"
          :to="cta.buttonUrl"
        >
          {{ cta.buttonText }}
        </ArcButton>
      </div>

      <!-- Stats bar -->
      <div class="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
        <div v-for="stat in hero.stats" :key="stat.statLabel">
          <div class="text-2xl font-bold text-white">{{ stat.statValue }}</div>
          <div class="text-xs text-glacier/40 mt-1">{{ stat.statLabel }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
