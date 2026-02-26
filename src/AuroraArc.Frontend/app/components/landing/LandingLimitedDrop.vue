<script setup lang="ts">
const { data: drops } = await useProducts({ limitedDrop: true })

const firstDrop = computed(() => drops.value?.[0])
const endDate = computed(() => firstDrop.value?.limitedDropEnds || '')

const { days, hours, minutes, seconds, isExpired } = useCountdown(endDate.value)
const { formatPrice } = useFormatPrice()
</script>

<template>
  <section v-if="drops.length > 0 && !isExpired" class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="glass rounded-2xl p-8 sm:p-12 relative overflow-hidden">
        <!-- Background glow -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-coral/8 rounded-full blur-[120px]" />
        <div class="absolute bottom-0 left-0 w-72 h-72 bg-violet/5 rounded-full blur-[100px]" />

        <div class="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <!-- Content -->
          <div>
            <ArcBadge color="coral" class="mb-4">Limited Drop</ArcBadge>
            <h2 class="text-3xl sm:text-4xl font-bold text-white">
              Time-Sensitive <span class="text-gradient-coral">Releases</span>
            </h2>
            <p class="text-glacier/50 mt-3 leading-relaxed">
              Exclusive gear drops available for a limited time. Once they're gone, they're gone.
            </p>

            <!-- Countdown -->
            <div class="flex gap-4 mt-8">
              <div v-for="(val, label) in { Days: days, Hours: hours, Min: minutes, Sec: seconds }" :key="label" class="text-center">
                <div class="w-16 h-16 glass-light rounded-lg flex items-center justify-center">
                  <span class="text-2xl font-bold text-white">{{ String(val).padStart(2, '0') }}</span>
                </div>
                <span class="text-[10px] text-glacier/40 mt-1.5 block">{{ label }}</span>
              </div>
            </div>
          </div>

          <!-- Drop products -->
          <div class="grid grid-cols-2 gap-4">
            <NuxtLink
              v-for="drop in drops"
              :key="drop.sku"
              :to="`/product/${drop.slug}`"
              class="glass-light rounded-xl p-4 hover:border-coral/25 transition-all group"
            >
              <div class="aspect-square rounded-lg overflow-hidden mb-3">
                <ProductPlaceholderSvg :category="drop.category" :color="drop.accentColor" />
              </div>
              <h4 class="text-sm font-medium text-white group-hover:text-coral transition-colors">{{ drop.name }}</h4>
              <p class="text-sm font-bold text-coral mt-1">{{ formatPrice(drop.price) }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
