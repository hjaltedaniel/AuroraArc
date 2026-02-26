namespace AuroraArc.Core.Commerce.Options;

/// <summary>
/// Configuration options for the Umbraco Compose integration.
/// Bound from the "UmbracoCompose" section in appsettings.json.
/// </summary>
public sealed class ComposeOptions
{
    public const string SectionName = "UmbracoCompose";

    /// <summary>OAuth2 client ID for Umbraco Compose management API.</summary>
    public string ClientId { get; set; } = string.Empty;

    /// <summary>OAuth2 client secret for Umbraco Compose management API.</summary>
    public string ClientSecret { get; set; } = string.Empty;

    /// <summary>
    /// GraphQL endpoint for the Compose project/environment.
    /// Example: https://graphql.germanywestcentral.umbracocompose.com/{project}/{environment}
    /// </summary>
    public string GraphQLEndpoint { get; set; } = string.Empty;

    /// <summary>
    /// GUID of the default currency record in Umbraco Commerce.
    /// Find this in the back-office under Settings > Currencies.
    /// All product prices from Compose will be mapped to this currency.
    /// </summary>
    public Guid DefaultCurrencyId { get; set; }
}
