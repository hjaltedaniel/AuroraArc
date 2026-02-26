using System.Text.Json.Serialization;

namespace AuroraArc.Core.Commerce.Client;

/// <summary>
/// Deserialized response from the Umbraco Compose OAuth2 token endpoint.
/// </summary>
internal sealed class TokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;

    [JsonPropertyName("token_type")]
    public string TokenType { get; set; } = string.Empty;

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}
