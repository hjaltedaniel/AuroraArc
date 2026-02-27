/**
 * Shared Compose content fetching utility.
 *
 * Exposes three cached fetch functions:
 *  - fetchSiteSettings()   → SiteSettings
 *  - fetchLandingPage()    → LandingPageSections
 *  - fetchJournalEntries() → JournalEntry[]
 *
 * All results are cached for 5 minutes (TTL-based) to avoid redundant
 * Compose round-trips across concurrent SSR requests.
 *
 * SCHEMA NOTE: Several fields in this Compose project are stored as JSON
 * scalar types (`headerNavLinks.items`, `footerColumns.items`,
 * `pageSections.items`, and the nested `ctas`/`stats` within HeroSection).
 * These fields cannot be sub-selected in GraphQL — they are queried as leaf
 * scalars and parsed as raw BlockList arrays in the mapper functions below.
 * The shape of each item follows the Compose BlockList convention:
 *   { content: { id, contentType, properties: {...} }, settings: null }
 */

import type {
  SiteSettings,
  NavLink,
  FooterLink,
  FooterColumn,
  HeroCta,
  HeroStat,
  LandingPageSections,
  JournalEntry,
} from '~~/shared/types/content'

// ---------------------------------------------------------------------------
// GraphQL query
// ---------------------------------------------------------------------------

const CONTENT_QUERY = /* GraphQL */ `
{
  content(first: 50) {
    items {
      id
      __typename
      ... on SiteSettings {
        properties {
          siteTitle
          logoText
          logoHighlight
          copyrightText
          bottomNotice
          footerBrandDescription
          headerNavLinks { items }
          footerColumns { items }
        }
      }
      ... on LandingPage {
        properties {
          pageTitle
          pageSections { items }
        }
      }
      ... on JournalEntry {
        properties {
          title
          excerpt
          tag
          tagColor
          publishDate
          body { markup }
        }
      }
    }
  }
}
`

// ---------------------------------------------------------------------------
// Raw Compose types
// ---------------------------------------------------------------------------

/**
 * Shape of a single item inside a Compose BlockList JSON scalar.
 * `contentType` is the CMS alias (e.g. "NavLink", "HeroSection").
 */
interface ComposeBlockItem {
  content: {
    id: string
    contentType: string
    properties: Record<string, unknown>
  } | null
  settings: unknown
}

interface ComposeSiteSettings {
  __typename: 'SiteSettings'
  id: string
  properties: {
    siteTitle: string | null
    logoText: string | null
    logoHighlight: string | null
    copyrightText: string | null
    bottomNotice: string | null
    footerBrandDescription: string | null
    /** `.items` is a JSON scalar – queried as a leaf, parsed below */
    headerNavLinks: { items: unknown } | null
    /** `.items` is a JSON scalar – queried as a leaf, parsed below */
    footerColumns: { items: unknown } | null
  } | null
}

interface ComposeLandingPage {
  __typename: 'LandingPage'
  id: string
  properties: {
    pageTitle: string | null
    /** `.items` is a JSON scalar – queried as a leaf, parsed below */
    pageSections: { items: unknown } | null
  } | null
}

interface ComposeJournalEntry {
  __typename: 'JournalEntry'
  id: string
  properties: {
    title: string | null
    excerpt: string | null
    tag: string | null
    tagColor: string | null
    publishDate: string | null
    body: { markup: string } | null
  } | null
}

type ComposeContentItem =
  | ComposeSiteSettings
  | ComposeLandingPage
  | ComposeJournalEntry
  | { __typename: string; id: string }

// ---------------------------------------------------------------------------
// Default fallback values
// ---------------------------------------------------------------------------

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'Aurora Arc — Precision Expedition Gear',
  logoText: 'Aurora',
  logoHighlight: 'Arc',
  copyrightText: '© Aurora Arc. All rights reserved.',
  bottomNotice: 'This is a demo storefront.',
  footerBrandDescription: 'Precision expedition gear fusing cutting-edge technology with rugged field performance.',
  headerNavLinks: [
    { label: 'Shop', url: '/shop' },
    { label: 'Navigation', url: '/category/navigation-gear' },
    { label: 'Wearable', url: '/category/wearable-tech' },
    { label: 'Expedition', url: '/category/expedition-equipment' },
  ],
  footerColumns: [
    {
      title: 'Explore',
      links: [
        { label: 'All Products', url: '/shop' },
        { label: 'New Arrivals', url: '/shop?filter=new' },
        { label: 'Limited Drops', url: '/shop?filter=limited' },
        { label: 'Field Journal', url: '/journal' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Our Story', url: '/about' },
        { label: 'Technology', url: '/technology' },
        { label: 'Sustainability', url: '/sustainability' },
        { label: 'Careers', url: '/careers' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', url: '/contact' },
        { label: 'Shipping & Returns', url: '/shipping' },
        { label: 'Warranty', url: '/warranty' },
        { label: 'FAQ', url: '/faq' },
      ],
    },
  ],
}

const DEFAULT_LANDING_PAGE: LandingPageSections = {
  hero: {
    announcementBadge: 'New Limited Drops Available',
    headlineBefore: 'Navigate',
    headlineHighlight: 'Beyond',
    headlineAfter: 'the Known',
    tagline: 'Precision expedition gear fusing cutting-edge technology with rugged field performance. Built for explorers who refuse to compromise.',
    ctas: [
      { buttonText: 'Explore Gear', buttonUrl: '/shop' },
      { buttonText: 'View Drops', buttonUrl: '/shop?filter=limited' },
    ],
    stats: [
      { statValue: '18', statLabel: 'Products' },
      { statValue: '5', statLabel: 'Categories' },
      { statValue: '4', statLabel: 'Tech Levels' },
    ],
  },
  featuredGrid: {
    titleBefore: 'Featured',
    titleHighlight: 'Gear',
    subtitle: 'Hand-picked by our expedition team',
    viewAllText: 'View All',
    viewAllUrl: '/shop',
  },
  categoryShowcase: {
    titleBefore: 'Shop by',
    titleHighlight: 'Category',
  },
  limitedDrop: {
    badgeText: 'Limited Drop',
    titleBefore: 'Time-Sensitive',
    titleHighlight: 'Releases',
    description: 'Exclusive gear drops with limited quantities. Once they\'re gone, they\'re gone. Secure yours before the countdown ends.',
    countdownEndDate: '2026-12-31T23:59:59',
  },
  fieldJournal: {
    titleBefore: 'Field',
    titleHighlight: 'Journal',
    subtitle: 'Stories from the edge of exploration',
  },
}

const DEFAULT_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'e6918e0c',
    title: 'Crossing the Ice: 14 Days on the Vatnajökull Glacier',
    excerpt: 'Our team put the Arc Navigator Pro through its paces on one of Europe\'s most demanding ice fields. Here\'s what we learned.',
    tag: 'Expedition Report',
    tagColor: 'teal',
    publishDate: '2025-11-15',
    bodyMarkup: '',
  },
  {
    id: 'b0b9eafd',
    title: 'The Future of Trail Navigation is AI',
    excerpt: 'How machine learning is transforming how we move through wilderness environments — and what it means for gear design.',
    tag: 'Technology',
    tagColor: 'violet',
    publishDate: '2025-10-22',
    bodyMarkup: '',
  },
  {
    id: 'b2127949',
    title: 'Leave No Trace, Leave Better Tech',
    excerpt: 'Sustainability isn\'t just about materials. We explore how low-power design and repairability are reshaping expedition electronics.',
    tag: 'Sustainability',
    tagColor: 'glacier',
    publishDate: '2025-09-30',
    bodyMarkup: '',
  },
]

// ---------------------------------------------------------------------------
// JSON scalar parsing helpers
// ---------------------------------------------------------------------------

/**
 * Coerce an unknown value to a `ComposeBlockItem[]`.
 * Returns an empty array for anything that isn't an array.
 */
function asBlocks(raw: unknown): ComposeBlockItem[] {
  return Array.isArray(raw) ? (raw as ComposeBlockItem[]) : []
}

/**
 * Normalise a raw JSON scalar that might be either:
 *   - already an array:         `[{ content: {...} }, ...]`
 *   - a connection wrapper:     `{ items: [...] }`
 * Returns the inner array in both cases.
 */
function toItemsArray(raw: unknown): unknown {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object' && 'items' in raw) {
    return (raw as { items: unknown }).items
  }
  return []
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapNavLinksFromJson(raw: unknown): NavLink[] {
  return asBlocks(toItemsArray(raw))
    .map((item) => {
      const p = item?.content?.properties
      if (!p) return null
      return {
        label: (p.label as string | null) ?? '',
        url: (p.url as string | null) ?? '#',
      }
    })
    .filter((l): l is NavLink => l !== null && Boolean(l.label))
}

function mapFooterLinksFromJson(raw: unknown): FooterLink[] {
  const arr = Array.isArray(raw) ? raw : (toItemsArray(raw) as unknown[])
  if (!Array.isArray(arr)) return []
  return (arr as unknown[])
    .map((item: unknown) => {
      if (!item || typeof item !== 'object') return null
      const obj = item as Record<string, unknown>
      // MultiUrlPicker shape: { name, url, ... }
      if ('url' in obj) {
        return {
          label: (obj.name as string | null) ?? (obj.label as string | null) ?? '',
          url: (obj.url as string | null) ?? '#',
        }
      }
      // BlockList shape fallback: { content: { properties: { label, url } } }
      const block = item as ComposeBlockItem
      const p = block?.content?.properties
      if (!p) return null
      return {
        label: (p.label as string | null) ?? '',
        url: (p.url as string | null) ?? '#',
      }
    })
    .filter((l): l is FooterLink => l !== null && Boolean(l.label))
}

function mapFooterColumnsFromJson(raw: unknown): FooterColumn[] {
  return asBlocks(toItemsArray(raw))
    .map((item) => {
      const p = item?.content?.properties
      if (!p) return null
      // The Compose content type may use any of these aliases for the column heading
      const title =
        (p.title as string | null) ??
        (p.columnTitle as string | null) ??
        (p.heading as string | null) ??
        (p.name as string | null) ??
        ''
      return {
        title,
        links: mapFooterLinksFromJson(p.links),
      }
    })
    .filter((c): c is FooterColumn => c !== null && Boolean(c.title))
}

function mapCtasFromJson(raw: unknown): HeroCta[] {
  return asBlocks(toItemsArray(raw))
    .map((item) => {
      const p = item?.content?.properties
      if (!p) return null
      return {
        buttonText: (p.buttonText as string | null) ?? '',
        buttonUrl: (p.buttonUrl as string | null) ?? '#',
      }
    })
    .filter((c): c is HeroCta => c !== null && Boolean(c.buttonText))
}

function mapStatsFromJson(raw: unknown): HeroStat[] {
  return asBlocks(toItemsArray(raw))
    .map((item) => {
      const p = item?.content?.properties
      if (!p) return null
      return {
        statValue: (p.statValue as string | null) ?? '',
        statLabel: (p.statLabel as string | null) ?? '',
      }
    })
    .filter((s): s is HeroStat => s !== null && Boolean(s.statValue))
}

function mapSiteSettings(raw: ComposeSiteSettings): SiteSettings {
  const p = raw.properties
  if (!p) return DEFAULT_SITE_SETTINGS

  const navLinks = mapNavLinksFromJson(p.headerNavLinks?.items)
  const footerColumns = mapFooterColumnsFromJson(p.footerColumns?.items)

  return {
    siteTitle: p.siteTitle ?? DEFAULT_SITE_SETTINGS.siteTitle,
    logoText: p.logoText ?? DEFAULT_SITE_SETTINGS.logoText,
    logoHighlight: p.logoHighlight ?? DEFAULT_SITE_SETTINGS.logoHighlight,
    copyrightText: p.copyrightText ?? DEFAULT_SITE_SETTINGS.copyrightText,
    bottomNotice: p.bottomNotice ?? DEFAULT_SITE_SETTINGS.bottomNotice,
    footerBrandDescription: p.footerBrandDescription ?? DEFAULT_SITE_SETTINGS.footerBrandDescription,
    headerNavLinks: navLinks.length > 0 ? navLinks : DEFAULT_SITE_SETTINGS.headerNavLinks,
    footerColumns: footerColumns.length > 0 ? footerColumns : DEFAULT_SITE_SETTINGS.footerColumns,
  }
}

function mapLandingPage(raw: ComposeLandingPage): LandingPageSections {
  // pageSections.items is a JSON scalar: an array of ComposeBlockItem
  const sections = asBlocks(raw.properties?.pageSections?.items)

  let hero = DEFAULT_LANDING_PAGE.hero
  let featuredGrid = DEFAULT_LANDING_PAGE.featuredGrid
  let categoryShowcase = DEFAULT_LANDING_PAGE.categoryShowcase
  let limitedDrop = DEFAULT_LANDING_PAGE.limitedDrop
  let fieldJournal = DEFAULT_LANDING_PAGE.fieldJournal

  for (const section of sections) {
    const contentType = section?.content?.contentType
    const p = section?.content?.properties
    if (!contentType || !p) continue

    switch (contentType) {
      case 'HeroSection': {
        // ctas and stats are also JSON scalars within the section properties
        const ctas = mapCtasFromJson(p.ctas)
        const stats = mapStatsFromJson(p.stats)
        hero = {
          announcementBadge: (p.announcementBadge as string | null) ?? DEFAULT_LANDING_PAGE.hero.announcementBadge,
          headlineBefore: (p.headlineBefore as string | null) ?? DEFAULT_LANDING_PAGE.hero.headlineBefore,
          headlineHighlight: (p.headlineHighlight as string | null) ?? DEFAULT_LANDING_PAGE.hero.headlineHighlight,
          headlineAfter: (p.headlineAfter as string | null) ?? DEFAULT_LANDING_PAGE.hero.headlineAfter,
          tagline: (p.tagline as string | null) ?? DEFAULT_LANDING_PAGE.hero.tagline,
          ctas: ctas.length > 0 ? ctas : DEFAULT_LANDING_PAGE.hero.ctas,
          stats: stats.length > 0 ? stats : DEFAULT_LANDING_PAGE.hero.stats,
        }
        break
      }
      case 'FeaturedGridSection': {
        featuredGrid = {
          titleBefore: (p.titleBefore as string | null) ?? DEFAULT_LANDING_PAGE.featuredGrid.titleBefore,
          titleHighlight: (p.titleHighlight as string | null) ?? DEFAULT_LANDING_PAGE.featuredGrid.titleHighlight,
          subtitle: (p.subtitle as string | null) ?? DEFAULT_LANDING_PAGE.featuredGrid.subtitle,
          viewAllText: (p.viewAllText as string | null) ?? DEFAULT_LANDING_PAGE.featuredGrid.viewAllText,
          viewAllUrl: (p.viewAllUrl as string | null) ?? DEFAULT_LANDING_PAGE.featuredGrid.viewAllUrl,
        }
        break
      }
      case 'CategoryShowcaseSection': {
        categoryShowcase = {
          titleBefore: (p.titleBefore as string | null) ?? DEFAULT_LANDING_PAGE.categoryShowcase.titleBefore,
          titleHighlight: (p.titleHighlight as string | null) ?? DEFAULT_LANDING_PAGE.categoryShowcase.titleHighlight,
        }
        break
      }
      case 'LimitedDropSection': {
        limitedDrop = {
          badgeText: (p.badgeText as string | null) ?? DEFAULT_LANDING_PAGE.limitedDrop.badgeText,
          titleBefore: (p.titleBefore as string | null) ?? DEFAULT_LANDING_PAGE.limitedDrop.titleBefore,
          titleHighlight: (p.titleHighlight as string | null) ?? DEFAULT_LANDING_PAGE.limitedDrop.titleHighlight,
          description: (p.description as string | null) ?? DEFAULT_LANDING_PAGE.limitedDrop.description,
          countdownEndDate: (p.countdownEndDate as string | null) ?? DEFAULT_LANDING_PAGE.limitedDrop.countdownEndDate,
        }
        break
      }
      case 'FieldJournalSection': {
        fieldJournal = {
          titleBefore: (p.titleBefore as string | null) ?? DEFAULT_LANDING_PAGE.fieldJournal.titleBefore,
          titleHighlight: (p.titleHighlight as string | null) ?? DEFAULT_LANDING_PAGE.fieldJournal.titleHighlight,
          subtitle: (p.subtitle as string | null) ?? DEFAULT_LANDING_PAGE.fieldJournal.subtitle,
        }
        break
      }
    }
  }

  return { hero, featuredGrid, categoryShowcase, limitedDrop, fieldJournal }
}

function mapJournalEntry(raw: ComposeJournalEntry): JournalEntry {
  const p = raw.properties
  return {
    id: raw.id,
    title: p?.title ?? '',
    excerpt: p?.excerpt ?? '',
    tag: p?.tag ?? '',
    tagColor: Array.isArray(p?.tagColor) ? (p?.tagColor as string[])[0] ?? 'teal' : p?.tagColor ?? 'teal',
    publishDate: p?.publishDate ?? '',
    bodyMarkup: p?.body?.markup ?? '',
  }
}

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

interface ContentCache {
  siteSettings: SiteSettings
  landingPage: LandingPageSections
  journalEntries: JournalEntry[]
  fetchedAt: number
}

const CACHE_TTL_MS = 5 * 60 * 1_000 // 5 minutes
let _cache: ContentCache | null = null

// ---------------------------------------------------------------------------
// Core fetch
// ---------------------------------------------------------------------------

async function fetchContent(bustCache = false): Promise<ContentCache> {
  if (!bustCache && _cache && Date.now() - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache
  }

  let data: { content: { items: ComposeContentItem[] } }
  try {
    data = await composeQuery<{ content: { items: ComposeContentItem[] } }>(CONTENT_QUERY)
  } catch (err) {
    console.warn('[composeContent] Compose unavailable – using static defaults:', (err as Error).message)
    const result: ContentCache = {
      siteSettings: DEFAULT_SITE_SETTINGS,
      landingPage: DEFAULT_LANDING_PAGE,
      journalEntries: DEFAULT_JOURNAL_ENTRIES,
      fetchedAt: Date.now(),
    }
    _cache = result
    return result
  }

  let siteSettings: SiteSettings = DEFAULT_SITE_SETTINGS
  let landingPage: LandingPageSections = DEFAULT_LANDING_PAGE
  const journalEntries: JournalEntry[] = []

  for (const item of data.content.items) {
    if (item.__typename === 'SiteSettings') {
      siteSettings = mapSiteSettings(item as ComposeSiteSettings)
    } else if (item.__typename === 'LandingPage') {
      landingPage = mapLandingPage(item as ComposeLandingPage)
    } else if (item.__typename === 'JournalEntry') {
      const entry = mapJournalEntry(item as ComposeJournalEntry)
      if (entry.title) journalEntries.push(entry)
    }
  }

  // Sort journal entries by publishDate descending
  journalEntries.sort((a, b) => {
    if (!a.publishDate) return 1
    if (!b.publishDate) return -1
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })

  const result: ContentCache = {
    siteSettings,
    landingPage,
    journalEntries: journalEntries.length > 0 ? journalEntries : DEFAULT_JOURNAL_ENTRIES,
    fetchedAt: Date.now(),
  }

  _cache = result
  return result
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchSiteSettings(bustCache = false): Promise<SiteSettings> {
  const { siteSettings } = await fetchContent(bustCache)
  return siteSettings
}

export async function fetchLandingPage(bustCache = false): Promise<LandingPageSections> {
  const { landingPage } = await fetchContent(bustCache)
  return landingPage
}

export async function fetchJournalEntries(bustCache = false): Promise<JournalEntry[]> {
  const { journalEntries } = await fetchContent(bustCache)
  return journalEntries
}
