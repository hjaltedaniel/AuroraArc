<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

const component = computed(() => (props.to ? resolveComponent('NuxtLink') : 'button'))

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 cursor-pointer select-none'

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variants: Record<string, string> = {
    primary: 'bg-teal text-midnight hover:bg-teal-dim hover:glow-teal active:scale-[0.97]',
    secondary: 'glass text-glacier hover:border-teal/25 hover:text-white active:scale-[0.97]',
    accent: 'bg-coral text-white hover:bg-coral-dim hover:glow-coral active:scale-[0.97]',
  }

  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return [base, sizes[props.size], variants[props.variant], disabledClass].join(' ')
})
</script>

<template>
  <component
    :is="component"
    :to="to"
    :disabled="disabled"
    :class="classes"
  >
    <slot />
  </component>
</template>
