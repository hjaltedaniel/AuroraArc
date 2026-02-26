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

  const response = await $fetch<{
    data: T
    errors?: Array<{ message: string }>
  }>(config.composeGraphqlEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: { query, variables },
  })

  if (response.errors?.length) {
    throw createError({
      statusCode: 502,
      statusMessage: `Compose GraphQL error: ${response.errors.map(e => e.message).join(', ')}`,
    })
  }

  return response.data
}
