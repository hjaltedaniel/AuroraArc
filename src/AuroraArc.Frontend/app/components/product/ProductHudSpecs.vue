<script setup lang="ts">
import type { TechSpecs, BrandColor } from '~~/shared/types/product'

defineProps<{
  specs: TechSpecs[]
  color?: BrandColor
}>()

const colorAccent: Record<BrandColor, string> = {
  teal: 'text-teal',
  coral: 'text-coral',
  violet: 'text-violet',
  glacier: 'text-glacier',
}
</script>

<template>
  <div class="glass rounded-xl p-6">
    <div class="flex items-center gap-2 mb-5">
      <div class="w-2 h-2 rounded-full bg-teal animate-pulse" />
      <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Tech Specs</h3>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div
        v-for="spec in specs"
        :key="spec.label"
        class="glass-light rounded-lg p-3"
      >
        <div class="text-[10px] text-glacier/40 uppercase tracking-wider mb-1">{{ spec.label }}</div>
        <div class="flex items-baseline gap-1">
          <span :class="['text-lg font-bold', colorAccent[color || 'teal']]">{{ spec.value }}</span>
          <span v-if="spec.unit" class="text-xs text-glacier/50">{{ spec.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
