import type { SiteSettings } from '~~/shared/types/content'

const DEFAULT: SiteSettings = {
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

export function useSiteSettings() {
  return useFetch<SiteSettings>('/api/cms/site-settings', {
    key: 'cms:site-settings',
    default: () => DEFAULT,
  })
}
