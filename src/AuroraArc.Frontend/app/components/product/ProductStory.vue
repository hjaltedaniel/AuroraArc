<script setup lang="ts">
defineProps<{
  excerpt: string
  full: string
}>()

const expanded = ref(false)
</script>

<template>
  <div class="glass rounded-xl p-6">
    <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">The Story</h3>

    <p class="text-glacier/70 leading-relaxed">
      {{ expanded ? full : excerpt }}
    </p>

    <button
      class="mt-4 text-sm text-teal hover:text-teal-dim transition-colors flex items-center gap-1"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Read less' : 'Read the full story' }}
      <svg
        :class="['w-3.5 h-3.5 transition-transform', expanded && 'rotate-180']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  </div>
</template>
