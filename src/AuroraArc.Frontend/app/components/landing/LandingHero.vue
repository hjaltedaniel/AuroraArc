<script setup lang="ts">
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
        New Limited Drops Available
      </div>

      <!-- Headline -->
      <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
        Navigate
        <span class="text-gradient-teal">Beyond</span>
        <br />
        the Known
      </h1>

      <!-- Subheading -->
      <p class="mt-6 text-lg sm:text-xl text-glacier/60 max-w-2xl mx-auto leading-relaxed">
        Precision expedition gear fusing cutting-edge tech with rugged field performance. Engineered for explorers who refuse to compromise.
      </p>

      <!-- CTAs -->
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <ArcButton variant="primary" size="lg" to="/shop">
          Explore the Collection
        </ArcButton>
        <ArcButton variant="secondary" size="lg" to="#featured">
          View Featured Gear
        </ArcButton>
      </div>

      <!-- Stats bar -->
      <div class="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
        <div>
          <div class="text-2xl font-bold text-white">18</div>
          <div class="text-xs text-glacier/40 mt-1">Products</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-white">5</div>
          <div class="text-xs text-glacier/40 mt-1">Categories</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-white">4</div>
          <div class="text-xs text-glacier/40 mt-1">Tech Levels</div>
        </div>
      </div>
    </div>
  </section>
</template>
