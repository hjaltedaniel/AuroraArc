/**
 * Umbraco Compose GraphQL client
 *
 * Handles OAuth2 client_credentials token acquisition with in-memory caching
 * and authenticated GraphQL query execution against the Compose endpoint.
 */

interface TokenCache {
  accessToken: string
  expiresAt: number
}

let _tokenCache: TokenCache | null = null

async function getAccessToken(): Promise<string> {
  const config = useRuntimeConfig()

  // Return cached token if still valid (with 60s buffer before expiry)
  if (_tokenCache && Date.now() < _tokenCache.expiresAt - 60_000) {
    return _tokenCache.accessToken
  }

  // Fail fast instead of sending a doomed request with empty credentials
  if (!config.composeClientId || !config.composeClientSecret) {
    throw new Error('[composeClient] Compose credentials not configured (set COMPOSE_CLIENT_ID and COMPOSE_CLIENT_SECRET)')
  }

  const response = await $fetch<{
    access_token: string
    expires_in: number
    token_type: string
  }>(config.composeTokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.composeClientId,
      client_secret: config.composeClientSecret,
    }).toString(),
  })

  if (!response.access_token) {
    throw new Error('[composeClient] Token endpoint returned no access_token — check response shape')
  }

  _tokenCache = {
    accessToken: response.access_token,
    expiresAt: Date.now() + response.expires_in * 1000,
  }

  return _tokenCache.accessToken
}

export async function composeQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const config = useRuntimeConfig()
  const token = await getAccessToken()

  // Use explicit JSON.stringify so the body is always a well-formed string
  // regardless of ofetch version behaviour. Always include `variables` (as
  // null when unset) — some GraphQL servers reject requests where the key is
  // absent entirely.
  const body = JSON.stringify({ query, variables: variables ?? null })

  let response: { data: T; errors?: Array<{ message: string }> }
  try {
    response = await $fetch<{
      data: T
      errors?: Array<{ message: string }>
    }>(config.composeGraphqlEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    })
  } catch (err: unknown) {
    // Log the raw Compose response body so we can see the actual rejection reason
    const fetchErr = err as { data?: unknown; statusCode?: number; status?: number }
    if (fetchErr.data !== undefined) {
      console.error(
        '[composeClient] Compose rejected the request (HTTP',
        fetchErr.statusCode ?? fetchErr.status ?? '?',
        '). Response body:',
        JSON.stringify(fetchErr.data, null, 2),
      )
    }
    throw err
  }

  if (response.errors?.length) {
    throw createError({
      statusCode: 502,
      statusMessage: `Compose GraphQL error: ${response.errors.map(e => e.message).join(', ')}`,
    })
  }

  return response.data
}
