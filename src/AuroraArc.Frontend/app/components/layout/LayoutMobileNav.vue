<script setup lang="ts">
const props = defineProps<{
  open: boolean
  links: { label: string; to: string }[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const route = useRoute()

watch(() => route.path, () => {
  emit('update:open', false)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div v-if="open" class="md:hidden absolute top-16 inset-x-0 glass border-t border-teal/10">
      <nav class="px-4 py-6 space-y-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block px-4 py-3 rounded-lg text-glacier/80 hover:text-teal hover:bg-teal/5 transition-colors"
          @click="emit('update:open', false)"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </Transition>
</template>
