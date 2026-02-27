import type { LandingPageSections } from '~~/shared/types/content'

const DEFAULT: LandingPageSections = {
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
    description: "Exclusive gear drops with limited quantities. Once they're gone, they're gone. Secure yours before the countdown ends.",
    countdownEndDate: '2026-12-31T23:59:59',
  },
  fieldJournal: {
    titleBefore: 'Field',
    titleHighlight: 'Journal',
    subtitle: 'Stories from the edge of exploration',
  },
}

export function useCmsHome() {
  return useFetch<LandingPageSections>('/api/cms/home', {
    key: 'cms:home',
    default: () => DEFAULT,
  })
}
