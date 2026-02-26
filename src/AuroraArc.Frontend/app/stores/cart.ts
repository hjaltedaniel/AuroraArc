import { defineStore } from 'pinia'
import type { CartItem, Product } from '~~/shared/types/product'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  function addItem(product: Product, quantity = 1) {
    const existing = items.value.find(i => i.product.sku === product.sku)
    if (existing) {
      existing.quantity += quantity
    }
    else {
      items.value.push({ product, quantity })
    }
    isOpen.value = true
  }

  function removeItem(sku: string) {
    items.value = items.value.filter(i => i.product.sku !== sku)
  }

  function updateQuantity(sku: string, quantity: number) {
    const item = items.value.find(i => i.product.sku === sku)
    if (item) {
      if (quantity <= 0) {
        removeItem(sku)
      }
      else {
        item.quantity = quantity
      }
    }
  }

  function toggleDrawer() {
    isOpen.value = !isOpen.value
  }

  function openDrawer() {
    isOpen.value = true
  }

  function closeDrawer() {
    isOpen.value = false
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    isOpen,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    clearCart,
  }
})
