using System.Net.Http.Json;
using AuroraArc.Core.Commerce.Options;
using Microsoft.Extensions.Options;

namespace AuroraArc.Core.Commerce.Client;

/// <summary>
/// Manages OAuth2 client-credentials tokens for the Umbraco Compose management API.
/// Tokens are cached in memory and refreshed with a 30-second safety buffer before expiry.
/// Thread-safe via SemaphoreSlim double-check pattern.
/// </summary>
public sealed class ComposeTokenService
{
    private const string TokenEndpoint = "https://management.umbracocompose.com/v1/auth/token";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ComposeOptions _options;
    private readonly SemaphoreSlim _semaphore = new(1, 1);

    private string? _cachedToken;
    private DateTimeOffset _tokenExpiry = DateTimeOffset.MinValue;

    public ComposeTokenService(IHttpClientFactory httpClientFactory, IOptions<ComposeOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    /// <summary>
    /// Returns a valid bearer token, refreshing if within 30 seconds of expiry.
    /// </summary>
    public async Task<string> GetTokenAsync(CancellationToken cancellationToken = default)
    {
        // Fast path — no lock needed if token is fresh
        if (_cachedToken is not null && DateTimeOffset.UtcNow < _tokenExpiry.AddSeconds(-30))
            return _cachedToken;

        await _semaphore.WaitAsync(cancellationToken);
        try
        {
            // Double-check inside the lock
            if (_cachedToken is not null && DateTimeOffset.UtcNow < _tokenExpiry.AddSeconds(-30))
                return _cachedToken;

            var client = _httpClientFactory.CreateClient("ComposeAuth");

            using var response = await client.PostAsync(
                TokenEndpoint,
                new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("grant_type", "client_credentials"),
                    new KeyValuePair<string, string>("client_id", _options.ClientId),
                    new KeyValuePair<string, string>("client_secret", _options.ClientSecret),
                }),
                cancellationToken);

            response.EnsureSuccessStatusCode();

            var tokenResponse = await response.Content.ReadFromJsonAsync<TokenResponse>(cancellationToken)
                ?? throw new InvalidOperationException("Umbraco Compose returned an empty token response.");

            _cachedToken = tokenResponse.AccessToken;
            _tokenExpiry = DateTimeOffset.UtcNow.AddSeconds(tokenResponse.ExpiresIn);

            return _cachedToken;
        }
        finally
        {
            _semaphore.Release();
        }
    }
}
