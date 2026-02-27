/**
 * TypeScript types for the Umbraco Commerce Storefront API v1.
 * These mirror the DTOs returned by:
 *   https://dev-aurora-arc.euwest01.umbraco.io/umbraco/commerce/storefront/api/v1/
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export interface CommercePrice {
  withTax: number
  withoutTax: number
  tax: number
}

export interface CommercePriceValue {
  value: CommercePrice
}

export interface CommerceTransactionAmount {
  value: {
    value: number
  }
}

// ---------------------------------------------------------------------------
// Order Line
// ---------------------------------------------------------------------------

export interface CommerceOrderLine {
  id: string
  name: string
  quantity: number
  sku: string
  productReference: string
  productVariantReference?: string | null
  basePrice: CommercePriceValue
  unitPrice: CommercePriceValue
  totalPrice: CommercePriceValue
  taxRate?: number
  properties?: Record<string, string> | null
}

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------

export interface CommerceCustomerInfo {
  email: string | null
  firstName: string | null
  lastName: string | null
  customerReference?: string | null
}

export interface CommercePaymentInfo {
  paymentMethod: { alias: string; id: string } | null
  country: { code: string } | null
  taxRate: number
  totalPrice: CommercePriceValue
}

export interface CommerceShippingInfo {
  shippingMethod: { alias: string; id: string } | null
  country: { code: string } | null
  taxRate: number
  totalPrice: CommercePriceValue
}

export interface CommerceOrder {
  id: string
  cartNumber: string
  orderNumber?: string | null
  isFinalized: boolean
  orderLines: CommerceOrderLine[]
  customerInfo: CommerceCustomerInfo
  paymentInfo: CommercePaymentInfo
  shippingInfo: CommerceShippingInfo
  subtotalPrice: CommercePriceValue
  totalPrice: CommercePriceValue
  transactionAmount: CommerceTransactionAmount
  taxRate?: number | null
  languageIsoCode?: string
  updateDate?: string
  createDate?: string
}

// ---------------------------------------------------------------------------
// Request bodies
// ---------------------------------------------------------------------------

export interface AddOrderLineRequest {
  productReference: string
  quantity: number
  productVariantReference?: string
  properties?: Record<string, string>
}

export interface UpdateOrderLineRequest {
  quantity: number
}

export interface CommerceCustomerUpdate {
  firstName?: string
  lastName?: string
  email?: string
}

export interface UpdateOrderRequest {
  customer?: CommerceCustomerUpdate
  paymentMethod?: string   // alias string, e.g. "stripe"
  shippingMethod?: string  // alias string
  languageIsoCode?: string
}

// ---------------------------------------------------------------------------
// Checkout token
// ---------------------------------------------------------------------------

export interface CheckoutTokenResponse {
  /** Stripe session ID or hosted checkout URL – shape depends on Commerce configuration */
  token?: string
  sessionId?: string
  url?: string
  [key: string]: unknown
}
