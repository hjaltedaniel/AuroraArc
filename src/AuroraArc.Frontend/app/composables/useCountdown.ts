export function useCountdown(endDate: string) {
  const now = ref(Date.now())
  const end = new Date(endDate).getTime()

  const remaining = computed(() => Math.max(0, end - now.value))
  const isExpired = computed(() => remaining.value <= 0)

  const days = computed(() => Math.floor(remaining.value / (1000 * 60 * 60 * 24)))
  const hours = computed(() => Math.floor((remaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const minutes = computed(() => Math.floor((remaining.value % (1000 * 60 * 60)) / (1000 * 60)))
  const seconds = computed(() => Math.floor((remaining.value % (1000 * 60)) / 1000))

  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { days, hours, minutes, seconds, isExpired }
}
