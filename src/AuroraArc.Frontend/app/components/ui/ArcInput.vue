<script setup lang="ts">
defineProps<{
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-sm font-medium text-glacier/80">
      {{ label }}
      <span v-if="required" class="text-coral">*</span>
    </label>
    <input
      v-model="model"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
      class="w-full px-4 py-3 rounded-lg bg-midnight-light border border-midnight-lighter text-glacier placeholder-glacier/30 transition-all duration-300 focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 focus:glow-teal"
    />
  </div>
</template>
