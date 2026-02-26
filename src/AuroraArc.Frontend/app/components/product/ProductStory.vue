<script setup lang="ts">
const props = defineProps<{
  excerpt: string
  full: string
}>()

const expanded = ref(false)

// Only show the expand button when there is additional content beyond the excerpt
const hasFullStory = computed(() => props.full && props.full !== props.excerpt)
</script>

<template>
  <div class="glass rounded-xl p-6">
    <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">The Story</h3>

    <!-- Collapsed: plain excerpt text -->
    <p v-if="!expanded" class="text-glacier/70 leading-relaxed">
      {{ excerpt }}
    </p>

    <!-- Expanded: full story may contain HTML markup from Compose longDescription -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      v-else
      class="text-glacier/70 leading-relaxed prose-story"
      v-html="full"
    />

    <button
      v-if="hasFullStory"
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

<style scoped>
/*
 * Minimal prose styles for the HTML content rendered from Compose longDescription.markup.
 * Scoped to .prose-story so it doesn't bleed into other components.
 */
.prose-story :deep(p) {
  margin-bottom: 0.75rem;
}

.prose-story :deep(p:last-child) {
  margin-bottom: 0;
}

.prose-story :deep(strong) {
  color: white;
  font-weight: 600;
}

.prose-story :deep(em) {
  font-style: italic;
}

.prose-story :deep(ul),
.prose-story :deep(ol) {
  margin: 0.5rem 0 0.75rem 1.25rem;
}

.prose-story :deep(ul) {
  list-style-type: disc;
}

.prose-story :deep(ol) {
  list-style-type: decimal;
}

.prose-story :deep(li) {
  margin-bottom: 0.25rem;
}
</style>
