/**
 * Shared Compose product fetching utility.
 *
 * Exposes `fetchAllProducts()` which:
 *  1. Queries Umbraco Compose GraphQL for all products
 *  2. Maps each result to the frontend `Product` shape via `mapComposeProduct`
 *  3. Caches the result in memory for 5 minutes (TTL-based)
 *
 * Both the PLP route (`/api/products`) and the PDP route (`/api/products/:sku`)
 * call this function so the Compose round-trip is shared across requests.
 */

import type { Product } from '~~/shared/types/product'
import type { ComposeProduct } from './productMapper'
import { mapComposeProduct } from './productMapper'
import { products as staticProducts } from './products'

// ---------------------------------------------------------------------------
// GraphQL query
// ---------------------------------------------------------------------------

const PRODUCTS_QUERY = /* GraphQL */ `
{
  products(first: 100) {
    items {
      id
      __typename
      ... on Product {
        name
        properties {
          sku
          productName
          subtitle
          status
          isFeatured
          isNew
          tags
          shortDescription
          longDescription { markup }
          heroImage {
            items {
              id
              __typename
              ... on Media {
                name
                qbankId
                crops {
                  desktop {
                    heroImage
                    blogImage
                  }
                }
              }
            }
          }
          basePrice
          salePrice
          currency
          isOnSale
          materials
          technicalSpecifications { items }
          connectivity
          powerSource
          batteryLife
          availability
          stockQuantity
        }
      }
    }
  }
}
`

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

interface ProductCache {
  products: Product[]
  fetchedAt: number
}

const CACHE_TTL_MS = 5 * 60 * 1_000 // 5 minutes

let _cache: ProductCache | null = null

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the full list of mapped, active Aurora Arc products from Compose.
 *
 * @param bustCache - Pass `true` to force a fresh fetch regardless of TTL.
 */
export async function fetchAllProducts(bustCache = false): Promise<Product[]> {
  if (!bustCache && _cache && Date.now() - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache.products
  }

  let data: { products: { items: ComposeProduct[] } }
  try {
    data = await composeQuery<{
      products: { items: ComposeProduct[] }
    }>(PRODUCTS_QUERY)
  } catch (err) {
    console.warn('[composeProducts] Compose unavailable – using static defaults:', (err as Error).message)
    _cache = { products: staticProducts, fetchedAt: Date.now() }
    return staticProducts
  }

  const products = data.products.items
    .map(mapComposeProduct)
    .filter((p): p is Product => p !== null)

  _cache = { products, fetchedAt: Date.now() }

  return products
}
