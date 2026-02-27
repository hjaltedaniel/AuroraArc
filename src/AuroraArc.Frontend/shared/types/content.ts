// ---------------------------------------------------------------------------
// CMS Content Types
// Mirrors the Umbraco Compose GraphQL schema for the `content` collection.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Site Settings
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string
  url: string
}

export interface FooterLink {
  label: string
  url: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface SiteSettings {
  siteTitle: string
  logoText: string
  logoHighlight: string
  copyrightText: string
  bottomNotice: string
  footerBrandDescription: string
  headerNavLinks: NavLink[]
  footerColumns: FooterColumn[]
}

// ---------------------------------------------------------------------------
// Landing Page sections
// ---------------------------------------------------------------------------

export interface HeroCta {
  buttonText: string
  buttonUrl: string
}

export interface HeroStat {
  statValue: string
  statLabel: string
}

export interface HeroSection {
  announcementBadge: string
  headlineBefore: string
  headlineHighlight: string
  headlineAfter: string
  tagline: string
  ctas: HeroCta[]
  stats: HeroStat[]
}

export interface FeaturedGridSection {
  titleBefore: string
  titleHighlight: string
  subtitle: string
  viewAllText: string
  viewAllUrl: string
}

export interface CategoryShowcaseSection {
  titleBefore: string
  titleHighlight: string
}

export interface LimitedDropSection {
  badgeText: string
  titleBefore: string
  titleHighlight: string
  description: string
  countdownEndDate: string
}

export interface FieldJournalSection {
  titleBefore: string
  titleHighlight: string
  subtitle: string
}

export interface LandingPageSections {
  hero: HeroSection
  featuredGrid: FeaturedGridSection
  categoryShowcase: CategoryShowcaseSection
  limitedDrop: LimitedDropSection
  fieldJournal: FieldJournalSection
}

// ---------------------------------------------------------------------------
// Journal Entries
// ---------------------------------------------------------------------------

export interface JournalEntry {
  id: string
  title: string
  excerpt: string
  tag: string
  tagColor: string
  publishDate: string
  bodyMarkup: string
}
