<script setup lang="ts">
const stories = [
  {
    title: 'Crossing the Ice: 14 Days on the Vatnajokull Glacier',
    excerpt: 'Our team tested the full Aurora Arc lineup across Europe\'s largest ice cap. What we learned changed how we design expedition gear.',
    tag: 'Expedition Report',
    color: 'teal' as const,
  },
  {
    title: 'The Future of Trail Navigation is AI',
    excerpt: 'How machine learning is transforming backcountry wayfinding - and why your next GPS will know the trail better than you do.',
    tag: 'Technology',
    color: 'violet' as const,
  },
  {
    title: 'Leave No Trace, Leave Better Tech',
    excerpt: 'Our sustainability commitments: carbon-neutral shipping, recycled materials, and a repair-first warranty program.',
    tag: 'Sustainability',
    color: 'glacier' as const,
  },
]

const colorClasses: Record<string, string> = {
  teal: 'bg-teal/10 text-teal',
  violet: 'bg-violet/10 text-violet',
  glacier: 'bg-glacier/10 text-glacier',
}
</script>

<template>
  <section class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-end justify-between mb-10">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-white">
            Field <span class="text-gradient-teal">Journal</span>
          </h2>
          <p class="text-glacier/50 mt-2">Stories from the edge of exploration</p>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="story in stories"
          :key="story.title"
          class="glass rounded-xl p-6 hover:border-teal/20 transition-all group cursor-pointer"
        >
          <!-- Tag -->
          <span :class="['inline-block px-3 py-1 rounded-full text-xs font-medium mb-4', colorClasses[story.color]]">
            {{ story.tag }}
          </span>

          <h3 class="text-lg font-semibold text-white group-hover:text-teal transition-colors leading-snug">
            {{ story.title }}
          </h3>
          <p class="text-sm text-glacier/50 mt-3 leading-relaxed line-clamp-3">
            {{ story.excerpt }}
          </p>

          <div class="mt-4 text-sm text-teal/70 group-hover:text-teal transition-colors flex items-center gap-1">
            Read more
            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
