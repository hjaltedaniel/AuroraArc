/**
 * Thin server-side HTTP client for the Umbraco Commerce Storefront API.
 *
 * All requests are authenticated with the Api-Key header and scoped to the
 * "auroraArc" store.  The base URL and API key are injected from runtimeConfig
 * so they can be overridden via environment variables in production.
 *
 * Usage:
 *   import { commerceFetch } from '~/server/utils/commerceClient'
 *   const order = await commerceFetch<CommerceOrder>('/orders', { method: 'POST' })
 */

import type { NitroFetchOptions } from 'nitropack'

const FALLBACK_BASE = 'https://dev-aurora-arc.euwest01.umbraco.io/umbraco/commerce/storefront/api/v1'
const FALLBACK_KEY  = 'a7F9kLm2Qx8ZpR4vT6yBn3HdW0sJcE5U'
const STORE_ALIAS   = 'auroraArc'

export async function commerceFetch<T = unknown>(
  path: string,
  options: {
    method?: NitroFetchOptions<string>['method']
    body?: unknown
    query?: Record<string, string | number | boolean>
  } = {},
): Promise<T> {
  const config = useRuntimeConfig()

  const base   = (config.commerceApiBase as string | undefined) || FALLBACK_BASE
  const apiKey = (config.commerceApiKey  as string | undefined) || FALLBACK_KEY

  const fetchOptions: NitroFetchOptions<string> = {
    method: options.method ?? 'GET',
    headers: {
      'Api-Key': apiKey,
      'Store':   STORE_ALIAS,
      'Content-Type': 'application/json',
    },
  }

  if (options.body !== undefined) {
    fetchOptions.body = options.body as BodyInit
  }

  if (options.query) {
    fetchOptions.query = options.query
  }

  const url = `${base}${path}`

  try {
    return await $fetch<T>(url, fetchOptions)
  }
  catch (err: unknown) {
    const status   = (err as { response?: { status?: number } })?.response?.status ?? 502
    const respData = (err as { data?: unknown })?.data ?? (err as { response?: { _data?: unknown } })?.response?._data
    const detail   = (respData as { detail?: string })?.detail ?? (respData as { title?: string })?.title ?? ''

    console.error(
      `[Commerce] ${options.method ?? 'GET'} ${url} → HTTP ${status}`,
      '\n  Store alias:', STORE_ALIAS,
      '\n  Response body:', JSON.stringify(respData ?? null),
      '\n  Raw error:', (err as Error)?.message,
    )

    throw createError({
      statusCode: status,
      statusMessage: `Commerce API error [${options.method ?? 'GET'} ${path}]${detail ? ': ' + detail : ''}`,
    })
  }
}
