import type { Product } from '~~/shared/types/product'

interface ProductFilters {
  category?: string
  activity?: string
  techLevel?: string
  featured?: boolean
  limitedDrop?: boolean
  sort?: string
}

export function useProducts(filters?: Ref<ProductFilters> | ProductFilters) {
  const query = computed(() => {
    const f = unref(filters) || {}
    const params: Record<string, string> = {}
    if (f.category) params.category = f.category
    if (f.activity) params.activity = f.activity
    if (f.techLevel) params.techLevel = f.techLevel
    if (f.featured) params.featured = 'true'
    if (f.limitedDrop) params.limitedDrop = 'true'
    if (f.sort) params.sort = f.sort
    return params
  })

  return useFetch<Product[]>('/api/products', {
    query,
    default: () => [],
  })
}

export function useProduct(identifier: string | Ref<string>) {
  return useFetch<Product>(() => `/api/products/${unref(identifier)}`, {
    default: () => null as unknown as Product,
  })
}
