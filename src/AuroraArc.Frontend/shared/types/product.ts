export type ProductCategory =
  | 'navigation-gear'
  | 'wearable-tech'
  | 'expedition-equipment'
  | 'shelter-camp'
  | 'illumination'

export type Activity =
  | 'hiking'
  | 'climbing'
  | 'trail-running'
  | 'camping'
  | 'kayaking'
  | 'skiing'
  | 'all-terrain'

export type TechLevel =
  | 'analog'
  | 'smart-hybrid'
  | 'full-digital'
  | 'ai-powered'

export type BrandColor = 'teal' | 'coral' | 'violet' | 'glacier'

export interface TechSpecs {
  label: string
  value: string
  unit?: string
}

export interface Product {
  sku: string
  slug: string
  name: string
  tagline: string
  description: string
  price: number
  compareAtPrice?: number
  category: ProductCategory
  activities: Activity[]
  techLevel: TechLevel
  techSpecs: TechSpecs[]
  featured: boolean
  limitedDrop: boolean
  limitedDropEnds?: string // ISO date
  accentColor: BrandColor
  storyExcerpt: string
  storyFull: string // may contain HTML markup from Compose longDescription
  inStock: boolean
  heroImageUrl?: string // populated when Compose heroImage is available
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export const categoryLabels: Record<ProductCategory, string> = {
  'navigation-gear': 'Navigation Gear',
  'wearable-tech': 'Wearable Tech',
  'expedition-equipment': 'Expedition Equipment',
  'shelter-camp': 'Shelter & Camp',
  'illumination': 'Illumination',
}

export const activityLabels: Record<Activity, string> = {
  'hiking': 'Hiking',
  'climbing': 'Climbing',
  'trail-running': 'Trail Running',
  'camping': 'Camping',
  'kayaking': 'Kayaking',
  'skiing': 'Skiing',
  'all-terrain': 'All-Terrain',
}

export const techLevelLabels: Record<TechLevel, string> = {
  'analog': 'Analog',
  'smart-hybrid': 'Smart Hybrid',
  'full-digital': 'Full Digital',
  'ai-powered': 'AI-Powered',
}
