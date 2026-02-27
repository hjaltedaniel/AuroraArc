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
 */

import type {
  SiteSettings,
  NavLink,
  FooterLink,
  FooterColumn,
  HeroCta,
  HeroStat,
  HeroSection,
  FeaturedGridSection,
  CategoryShowcaseSection,
  LimitedDropSection,
  FieldJournalSection,
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
          headerNavLinks {
            items {
              __typename
              ... on NavLink {
                properties {
                  label
                  url
                }
              }
            }
          }
          footerColumns {
            items {
              __typename
              ... on FooterColumn {
                properties {
                  title
                  links {
                    items {
                      __typename
                      ... on FooterLink {
                        properties {
                          label
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ... on LandingPage {
        properties {
          pageTitle
          pageSections {
            items {
              __typename
              ... on HeroSection {
                properties {
                  announcementBadge
                  headlineBefore
                  headlineHighlight
                  headlineAfter
                  tagline
                  ctas {
                    items {
                      __typename
                      ... on HeroCta {
                        properties {
                          buttonText
                          buttonUrl
                        }
                      }
                    }
                  }
                  stats {
                    items {
                      __typename
                      ... on HeroStat {
                        properties {
                          statValue
                          statLabel
                        }
                      }
                    }
                  }
                }
              }
              ... on FeaturedGridSection {
                properties {
                  titleBefore
                  titleHighlight
                  subtitle
                  viewAllText
                  viewAllUrl
                }
              }
              ... on CategoryShowcaseSection {
                properties {
                  titleBefore
                  titleHighlight
                }
              }
              ... on LimitedDropSection {
                properties {
                  badgeText
                  titleBefore
                  titleHighlight
                  description
                  countdownEndDate
                }
              }
              ... on FieldJournalSection {
                properties {
                  titleBefore
                  titleHighlight
                  subtitle
                }
              }
            }
          }
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

interface ComposeNavLinkItem {
  __typename: 'NavLink'
  properties: { label: string | null; url: string | null } | null
}

interface ComposeFooterLinkItem {
  __typename: 'FooterLink'
  properties: { label: string | null; url: string | null } | null
}

interface ComposeFooterColumnItem {
  __typename: 'FooterColumn'
  properties: {
    title: string | null
    links: { items: ComposeFooterLinkItem[] } | null
  } | null
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
    headerNavLinks: { items: ComposeNavLinkItem[] } | null
    footerColumns: { items: ComposeFooterColumnItem[] } | null
  } | null
}

interface ComposeHeroCtaItem {
  __typename: 'HeroCta'
  properties: { buttonText: string | null; buttonUrl: string | null } | null
}

interface ComposeHeroStatItem {
  __typename: 'HeroStat'
  properties: { statValue: string | null; statLabel: string | null } | null
}

interface ComposeHeroSection {
  __typename: 'HeroSection'
  properties: {
    announcementBadge: string | null
    headlineBefore: string | null
    headlineHighlight: string | null
    headlineAfter: string | null
    tagline: string | null
    ctas: { items: ComposeHeroCtaItem[] } | null
    stats: { items: ComposeHeroStatItem[] } | null
  } | null
}

interface ComposeFeaturedGridSection {
  __typename: 'FeaturedGridSection'
  properties: {
    titleBefore: string | null
    titleHighlight: string | null
    subtitle: string | null
    viewAllText: string | null
    viewAllUrl: string | null
  } | null
}

interface ComposeCategoryShowcaseSection {
  __typename: 'CategoryShowcaseSection'
  properties: {
    titleBefore: string | null
    titleHighlight: string | null
  } | null
}

interface ComposeLimitedDropSection {
  __typename: 'LimitedDropSection'
  properties: {
    badgeText: string | null
    titleBefore: string | null
    titleHighlight: string | null
    description: string | null
    countdownEndDate: string | null
  } | null
}

interface ComposeFieldJournalSection {
  __typename: 'FieldJournalSection'
  properties: {
    titleBefore: string | null
    titleHighlight: string | null
    subtitle: string | null
  } | null
}

type ComposeSectionItem =
  | ComposeHeroSection
  | ComposeFeaturedGridSection
  | ComposeCategoryShowcaseSection
  | ComposeLimitedDropSection
  | ComposeFieldJournalSection

interface ComposeLandingPage {
  __typename: 'LandingPage'
  id: string
  properties: {
    pageTitle: string | null
    pageSections: { items: ComposeSectionItem[] } | null
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

type ComposeContentItem = ComposeSiteSettings | ComposeLandingPage | ComposeJournalEntry | { __typename: string; id: string }

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
// Mappers
// ---------------------------------------------------------------------------

function mapNavLinks(items: ComposeNavLinkItem[]): NavLink[] {
  return items
    .filter(i => i.__typename === 'NavLink' && i.properties)
    .map(i => ({
      label: i.properties?.label ?? '',
      url: i.properties?.url ?? '#',
    }))
    .filter(l => l.label && l.url)
}

function mapFooterColumns(items: ComposeFooterColumnItem[]): FooterColumn[] {
  return items
    .filter(i => i.__typename === 'FooterColumn' && i.properties)
    .map(i => ({
      title: i.properties?.title ?? '',
      links: mapFooterLinks(i.properties?.links?.items ?? []),
    }))
    .filter(c => c.title)
}

function mapFooterLinks(items: ComposeFooterLinkItem[]): FooterLink[] {
  return items
    .filter(i => i.__typename === 'FooterLink' && i.properties)
    .map(i => ({
      label: i.properties?.label ?? '',
      url: i.properties?.url ?? '#',
    }))
    .filter(l => l.label)
}

function mapSiteSettings(raw: ComposeSiteSettings): SiteSettings {
  const p = raw.properties
  if (!p) return DEFAULT_SITE_SETTINGS

  const navLinks = mapNavLinks(p.headerNavLinks?.items ?? [])
  const footerColumns = mapFooterColumns(p.footerColumns?.items ?? [])

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

function mapHeroSection(raw: ComposeHeroSection): HeroSection {
  const p = raw.properties
  const def = DEFAULT_LANDING_PAGE.hero
  if (!p) return def

  const ctas: HeroCta[] = (p.ctas?.items ?? [])
    .filter(i => i.__typename === 'HeroCta' && i.properties)
    .map(i => ({ buttonText: i.properties?.buttonText ?? '', buttonUrl: i.properties?.buttonUrl ?? '#' }))
    .filter(c => c.buttonText)

  const stats: HeroStat[] = (p.stats?.items ?? [])
    .filter(i => i.__typename === 'HeroStat' && i.properties)
    .map(i => ({ statValue: i.properties?.statValue ?? '', statLabel: i.properties?.statLabel ?? '' }))
    .filter(s => s.statValue)

  return {
    announcementBadge: p.announcementBadge ?? def.announcementBadge,
    headlineBefore: p.headlineBefore ?? def.headlineBefore,
    headlineHighlight: p.headlineHighlight ?? def.headlineHighlight,
    headlineAfter: p.headlineAfter ?? def.headlineAfter,
    tagline: p.tagline ?? def.tagline,
    ctas: ctas.length > 0 ? ctas : def.ctas,
    stats: stats.length > 0 ? stats : def.stats,
  }
}

function mapFeaturedGridSection(raw: ComposeFeaturedGridSection): FeaturedGridSection {
  const p = raw.properties
  const def = DEFAULT_LANDING_PAGE.featuredGrid
  if (!p) return def
  return {
    titleBefore: p.titleBefore ?? def.titleBefore,
    titleHighlight: p.titleHighlight ?? def.titleHighlight,
    subtitle: p.subtitle ?? def.subtitle,
    viewAllText: p.viewAllText ?? def.viewAllText,
    viewAllUrl: p.viewAllUrl ?? def.viewAllUrl,
  }
}

function mapCategoryShowcaseSection(raw: ComposeCategoryShowcaseSection): CategoryShowcaseSection {
  const p = raw.properties
  const def = DEFAULT_LANDING_PAGE.categoryShowcase
  if (!p) return def
  return {
    titleBefore: p.titleBefore ?? def.titleBefore,
    titleHighlight: p.titleHighlight ?? def.titleHighlight,
  }
}

function mapLimitedDropSection(raw: ComposeLimitedDropSection): LimitedDropSection {
  const p = raw.properties
  const def = DEFAULT_LANDING_PAGE.limitedDrop
  if (!p) return def
  return {
    badgeText: p.badgeText ?? def.badgeText,
    titleBefore: p.titleBefore ?? def.titleBefore,
    titleHighlight: p.titleHighlight ?? def.titleHighlight,
    description: p.description ?? def.description,
    countdownEndDate: p.countdownEndDate ?? def.countdownEndDate,
  }
}

function mapFieldJournalSection(raw: ComposeFieldJournalSection): FieldJournalSection {
  const p = raw.properties
  const def = DEFAULT_LANDING_PAGE.fieldJournal
  if (!p) return def
  return {
    titleBefore: p.titleBefore ?? def.titleBefore,
    titleHighlight: p.titleHighlight ?? def.titleHighlight,
    subtitle: p.subtitle ?? def.subtitle,
  }
}

function mapLandingPage(raw: ComposeLandingPage): LandingPageSections {
  const sections = raw.properties?.pageSections?.items ?? []

  let hero = DEFAULT_LANDING_PAGE.hero
  let featuredGrid = DEFAULT_LANDING_PAGE.featuredGrid
  let categoryShowcase = DEFAULT_LANDING_PAGE.categoryShowcase
  let limitedDrop = DEFAULT_LANDING_PAGE.limitedDrop
  let fieldJournal = DEFAULT_LANDING_PAGE.fieldJournal

  for (const section of sections) {
    switch (section.__typename) {
      case 'HeroSection':
        hero = mapHeroSection(section as ComposeHeroSection)
        break
      case 'FeaturedGridSection':
        featuredGrid = mapFeaturedGridSection(section as ComposeFeaturedGridSection)
        break
      case 'CategoryShowcaseSection':
        categoryShowcase = mapCategoryShowcaseSection(section as ComposeCategoryShowcaseSection)
        break
      case 'LimitedDropSection':
        limitedDrop = mapLimitedDropSection(section as ComposeLimitedDropSection)
        break
      case 'FieldJournalSection':
        fieldJournal = mapFieldJournalSection(section as ComposeFieldJournalSection)
        break
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

  const data = await composeQuery<{ content: { items: ComposeContentItem[] } }>(CONTENT_QUERY)

  let siteSettings = DEFAULT_SITE_SETTINGS
  let landingPage = DEFAULT_LANDING_PAGE
  const journalEntries: JournalEntry[] = []

  for (const item of data.content.items) {
    switch (item.__typename) {
      case 'SiteSettings':
        siteSettings = mapSiteSettings(item as ComposeSiteSettings)
        break
      case 'LandingPage':
        landingPage = mapLandingPage(item as ComposeLandingPage)
        break
      case 'JournalEntry': {
        const entry = mapJournalEntry(item as ComposeJournalEntry)
        if (entry.title) journalEntries.push(entry)
        break
      }
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
