# Aurora Arc Frontend - Implementation Plan

## Overview
Build a fully functional, hardcoded storefront for Aurora Arc using the existing Nuxt 4 project at `src/AuroraArc.Frontend/`. HUD aesthetic, glassmorphism UI, Tailwind v4, Pinia, TypeScript.

## Phase 1: Foundation (install deps, configure toolchain)

1. **Install dependencies** - `@nuxtjs/tailwindcss`, `@nuxtjs/google-fonts`, `@pinia/nuxt`, `pinia`
2. **Configure `nuxt.config.ts`** - Register modules, Google Fonts (Poppins 300-800), Tailwind CSS path, app head/meta
3. **Create `app/assets/css/main.css`** - Tailwind v4 `@theme` with brand colors (Midnight, Teal, Coral, Glacier, Violet), font family, glassmorphism tokens. Custom `@utility` classes: `glass`, `glass-light`, `glow-teal`, `glow-violet`, `glow-coral`. Base styles for body, scrollbar.
4. **Create `shared/types/product.ts`** - TypeScript interfaces: `Product`, `TechSpecs`, `CartItem`, `CartState`. Type unions: `ProductCategory`, `Activity`, `TechLevel`, `BrandColor`. Label lookup maps.
5. **Update `app/app.vue`** - Replace `<NuxtWelcome />` with `<NuxtLayout><NuxtPage /></NuxtLayout>`

## Phase 2: Layout Shell & Core Components

6. **Create `app/layouts/default.vue`** - Flex column: Header, main slot, Footer, CartDrawer
7. **Create `app/stores/cart.ts`** - Pinia composition API store: items, isOpen, totalItems, subtotal, addItem, removeItem, updateQuantity, toggleDrawer, openDrawer, closeDrawer, clearCart
8. **Create UI components:**
   - `app/components/ui/ArcButton.vue` - Variants: primary(teal), secondary(glass), accent(coral). Glow on hover. Renders as NuxtLink or button.
   - `app/components/ui/ArcBadge.vue` - Pill badges for Limited Drop, tech levels, categories
   - `app/components/ui/ArcCard.vue` - Glassmorphic card container with optional hover glow
   - `app/components/ui/ArcInput.vue` - HUD-styled form input with teal focus glow
   - `app/components/ui/ProductPlaceholderSvg.vue` - Inline SVG with brand color + category icon
9. **Create layout components:**
   - `app/components/layout/LayoutHeader.vue` - Sticky glass navbar, logo, nav links, cart icon with badge, mobile hamburger
   - `app/components/layout/LayoutFooter.vue` - Dark footer, 3 columns, teal accent
   - `app/components/layout/LayoutCartDrawer.vue` - Slide-over from right, cart items, quantity controls, subtotal, checkout CTA
   - `app/components/layout/LayoutMobileNav.vue` - Full-screen overlay nav

## Phase 3: Data Layer

10. **Create composables:**
    - `app/composables/useFormatPrice.ts` - Intl.NumberFormat currency
    - `app/composables/useCountdown.ts` - Reactive countdown timer for Limited Drops
    - `app/composables/useProducts.ts` - Wraps useFetch for /api/products
11. **Create server data & API:**
    - `server/utils/products.ts` - 18 hardcoded products across 5 categories (Navigation Gear, Wearable Tech, Expedition Equipment, Shelter & Camp, Illumination)
    - `server/api/products.get.ts` - List with filtering (category, activity, techLevel, featured, limitedDrop) and sorting
    - `server/api/products/[sku].get.ts` - Single product lookup by SKU or slug

## Phase 4: Landing Page

12. **Create landing components:**
    - `app/components/landing/LandingHero.vue` - Full-viewport hero, animated HUD grid, tagline, dual CTAs
    - `app/components/landing/LandingFeaturedGrid.vue` - Featured products in 3-col grid
    - `app/components/landing/LandingCategoryShowcase.vue` - Horizontal scrolling category cards
    - `app/components/landing/LandingLimitedDrop.vue` - Countdown banner with product showcase
    - `app/components/landing/LandingFieldJournal.vue` - Editorial storytelling cards woven into commerce
    - `app/components/product/ProductCard.vue` - Glass card: placeholder SVG, badges, name, price, Add to Cart
13. **Create `app/pages/index.vue`** - Compose all landing sections

## Phase 5: Shop & Product Pages

14. **Create `app/pages/shop.vue`** - Product grid + sidebar filters (Category, Activity, Tech Level, Sort), URL query param sync
15. **Create `app/pages/category/[id].vue`** - Pre-filtered PLP by category
16. **Create PDP components:**
    - `app/components/product/ProductHudSpecs.vue` - HUD-styled tech spec panel
    - `app/components/product/ProductStory.vue` - Editorial lifestyle content block
17. **Create `app/pages/product/[sku].vue`** - Hero image + info, HUD spec sheet, Story section

## Phase 6: Checkout

18. **Create `app/pages/checkout.vue`** - Multi-step form: Shipping > Logistics > Payment. Progress bar, cart summary sidebar, confirmation view.

## File Count
~35 files to create/modify. All within `src/AuroraArc.Frontend/`.
