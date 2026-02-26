<script setup lang="ts">
withDefaults(defineProps<{
  hover?: boolean
  glow?: 'teal' | 'violet' | 'coral' | 'none'
}>(), {
  hover: true,
  glow: 'none',
})

const glowClasses: Record<string, string> = {
  teal: 'hover:glow-teal',
  violet: 'hover:glow-violet',
  coral: 'hover:glow-coral',
  none: '',
}
</script>

<template>
  <div
    :class="[
      'glass rounded-xl overflow-hidden transition-all duration-300',
      hover && 'hover:border-teal/25 hover:-translate-y-0.5',
      glowClasses[glow],
    ]"
  >
    <slot />
  </div>
</template>
