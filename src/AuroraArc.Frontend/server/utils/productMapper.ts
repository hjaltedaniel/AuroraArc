/**
 * Maps raw Umbraco Compose product responses to the frontend Product type.
 *
 * Key conventions in Compose data:
 * - `status === 'Active'`  → real Aurora Arc product (filters out test/demo entries)
 * - `tags` array encodes   → activities, techLevel, limitedDrop flag
 * - SKU prefix             → category
 * - `technicalSpecifications.items` → JSON scalar (array at runtime, no sub-selection)
 * - `longDescription.markup` → HTML string
 * - `heroImage.items`      → Media nodes with qbank CDN URLs via `crops.desktop.heroImage`
 */

import type {
  Product,
  ProductCategory,
  Activity,
  TechLevel,
  BrandColor,
  TechSpecs,
} from '~~/shared/types/product'

// ---------------------------------------------------------------------------
// Compose response types
// ---------------------------------------------------------------------------

export interface ComposeMediaCrops {
  heroImage?: string | null
  blogImage?: string | null
}

export interface ComposeMediaDesktopCrops {
  desktop?: ComposeMediaCrops | null
}

export interface ComposeMediaItem {
  id: string
  __typename: string
  name?: string | null
  qbankId?: string | null
  crops?: ComposeMediaDesktopCrops | null
}

export interface ComposeSpecRow {
  content: {
    id: string
    contentType: string
    properties: {
      label: string | null
      value: string | null
      unit: string | null
    }
  }
  settings: unknown
}

export interface ComposeProductProperties {
  sku: string | null
  productName: string | null
  subtitle: string | null
  status: string | null
  isFeatured: boolean | null
  isNew: boolean | null
  tags: string[] | null
  shortDescription: string | null
  longDescription: { markup: string } | null
  heroImage: { items: ComposeMediaItem[] } | null
  basePrice: number | null
  salePrice: number | null
  currency: string | null
  isOnSale: boolean | null
  materials: string | null
  technicalSpecifications: { items: unknown } | null
  connectivity: string | null
  powerSource: string | null
  batteryLife: string | null
  availability: string | null
  stockQuantity: number | null
}

export interface ComposeProduct {
  id: string
  __typename: string
  name: string
  properties: ComposeProductProperties
}

// ---------------------------------------------------------------------------
// Lookup tables
// ---------------------------------------------------------------------------

const SKU_CATEGORY_MAP: Record<string, ProductCategory> = {
  NAV: 'navigation-gear',
  WRB: 'wearable-tech',
  WTC: 'wearable-tech',
  EXP: 'expedition-equipment',
  SHL: 'shelter-camp',
  ILM: 'illumination',
}

const TECH_LEVELS: TechLevel[] = ['ai-powered', 'full-digital', 'smart-hybrid', 'analog']

const ACTIVITY_SET = new Set<Activity>([
  'hiking',
  'climbing',
  'trail-running',
  'camping',
  'kayaking',
  'skiing',
  'all-terrain',
])

const TECH_LEVEL_COLOR: Record<TechLevel, BrandColor> = {
  analog: 'glacier',
  'smart-hybrid': 'teal',
  'full-digital': 'violet',
  'ai-powered': 'coral',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalisedTags(tags: string[] | null): string[] {
  if (!tags) return []
  // Tags may come with spaces instead of dashes (e.g. "limited drop" → "limited-drop")
  return tags.map(t => t.trim().toLowerCase().replace(/\s+/g, '-'))
}

function deriveCategoryFromSku(sku: string | null): ProductCategory {
  if (!sku) return 'expedition-equipment'
  const prefix = sku.toUpperCase().slice(0, 3)
  return SKU_CATEGORY_MAP[prefix] ?? 'expedition-equipment'
}

function deriveTechLevel(tags: string[]): TechLevel {
  for (const level of TECH_LEVELS) {
    if (tags.includes(level)) return level
  }
  return 'analog'
}

function deriveActivities(tags: string[]): Activity[] {
  return tags.filter((t): t is Activity => ACTIVITY_SET.has(t as Activity))
}

function mapTechSpecs(raw: unknown): TechSpecs[] {
  if (!raw || !Array.isArray(raw)) return []
  return (raw as ComposeSpecRow[])
    .map((row) => {
      const p = row?.content?.properties
      if (!p) return null
      return {
        label: p.label ?? '',
        value: p.value ?? '',
        unit: p.unit ?? undefined,
      } satisfies TechSpecs
    })
    .filter((s): s is TechSpecs => s !== null && s.label !== '')
}

function resolveHeroImageUrl(heroImage: ComposeProductProperties['heroImage']): string | undefined {
  const item = heroImage?.items?.[0]
  if (!item || item.__typename !== 'Media') return undefined
  return item.crops?.desktop?.heroImage ?? item.crops?.desktop?.blogImage ?? undefined
}

// ---------------------------------------------------------------------------
// Main mapper
// ---------------------------------------------------------------------------

/**
 * Maps a single Compose product node to a frontend `Product`.
 * Returns `null` for non-product nodes or inactive/test products.
 */
export function mapComposeProduct(node: ComposeProduct): Product | null {
  // Only map real Product nodes that are Active
  if (node.__typename !== 'Product') return null

  const p = node.properties
  if (!p || p.status !== 'Active') return null

  const tags = normalisedTags(p.tags)
  const techLevel = deriveTechLevel(tags)
  const isOnSale = p.isOnSale === true
  const basePrice = p.basePrice ?? 0
  const salePrice = p.salePrice ?? basePrice

  return {
    sku: p.sku ?? node.id,
    slug: slugify(node.name),
    name: node.name,
    tagline: p.subtitle ?? p.productName ?? node.name,
    description: p.shortDescription ?? '',
    price: isOnSale ? salePrice : basePrice,
    compareAtPrice: isOnSale ? basePrice : undefined,
    category: deriveCategoryFromSku(p.sku),
    activities: deriveActivities(tags),
    techLevel,
    techSpecs: mapTechSpecs(p.technicalSpecifications?.items),
    featured: p.isFeatured === true,
    limitedDrop: tags.includes('limited-drop'),
    accentColor: TECH_LEVEL_COLOR[techLevel],
    storyExcerpt: p.shortDescription ?? '',
    storyFull: p.longDescription?.markup ?? p.shortDescription ?? '',
    inStock: p.availability === 'In Stock' || (p.stockQuantity != null && p.stockQuantity > 0),
    heroImageUrl: resolveHeroImageUrl(p.heroImage),
  }
}
