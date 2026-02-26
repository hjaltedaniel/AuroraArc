<script setup lang="ts">
withDefaults(defineProps<{
  color?: 'teal' | 'coral' | 'violet' | 'glacier'
}>(), {
  color: 'teal',
})

const colorClasses: Record<string, string> = {
  teal: 'bg-teal/15 text-teal border-teal/20',
  coral: 'bg-coral/15 text-coral border-coral/20',
  violet: 'bg-violet/15 text-violet border-violet/20',
  glacier: 'bg-glacier/15 text-glacier border-glacier/20',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      colorClasses[color],
    ]"
  >
    <slot />
  </span>
</template>
