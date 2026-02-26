using System.Net.Http.Json;
using System.Text.Json;
using AuroraArc.Core.Commerce.Client;
using AuroraArc.Core.Commerce.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AuroraArc.Core.Commerce.GraphQL;

/// <summary>
/// Thin HTTP client for the Umbraco Compose GraphQL API.
/// All queries are authenticated via bearer token obtained from <see cref="ComposeTokenService"/>.
/// </summary>
public sealed class ComposeGraphQLClient
{
    // Only fields that exist on the Product type in the Compose schema
    private const string ProductFields = """
        id
        ... on Product {
            name
            properties {
                sku
                productName
                basePrice
                salePrice
                currency
                stockQuantity
                status
                availability
                tags
                materials
                metaDescription
            }
        }
        """;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ComposeTokenService _tokenService;
    private readonly ComposeOptions _options;
    private readonly ILogger<ComposeGraphQLClient> _logger;

    public ComposeGraphQLClient(
        IHttpClientFactory httpClientFactory,
        ComposeTokenService tokenService,
        IOptions<ComposeOptions> options,
        ILogger<ComposeGraphQLClient> logger)
    {
        _httpClientFactory = httpClientFactory;
        _tokenService = tokenService;
        _options = options.Value;
        _logger = logger;
    }

    /// <summary>
    /// Fetches a single product by its Compose node ID.
    /// Returns <c>null</c> if the product is not found or is not typed as Product.
    /// </summary>
    internal async Task<ComposeProduct?> GetProductByIdAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        var query = $$"""
            {
              products(where: { id: "{{id}}" }) {
                items {
                  {{ProductFields}}
                }
              }
            }
            """;

        var data = await ExecuteAsync<ProductsData>(query, cancellationToken);
        var product = data?.Products?.Items?.FirstOrDefault(p => p.Id == id);

        // Filter out non-Product typed nodes (they have null Properties)
        return product?.Properties is not null ? product : null;
    }

    /// <summary>
    /// Fetches all products from the Compose catalog.
    /// Nodes that are not typed as Product (Properties == null) are filtered out.
    /// </summary>
    internal async Task<IReadOnlyList<ComposeProduct>> GetAllProductsAsync(
        CancellationToken cancellationToken = default)
    {
        var query = $$"""
            {
              products {
                items {
                  {{ProductFields}}
                }
              }
            }
            """;

        var data = await ExecuteAsync<ProductsData>(query, cancellationToken);

        return data?.Products?.Items?
            .Where(p => p.Properties?.Sku is not null)
            .ToList()
            ?? [];
    }

    // ─────────────────────────────────────────────────────────────────────────

    private async Task<T?> ExecuteAsync<T>(string query, CancellationToken cancellationToken)
    {
        var token = await _tokenService.GetTokenAsync(cancellationToken);
        var client = _httpClientFactory.CreateClient("ComposeGraphQL");

        using var request = new HttpRequestMessage(HttpMethod.Post, _options.GraphQLEndpoint)
        {
            Headers = { { "Authorization", $"Bearer {token}" } },
            Content = JsonContent.Create(new GraphQLRequest { Query = query }),
        };

        using var httpResponse = await client.SendAsync(request, cancellationToken);
        httpResponse.EnsureSuccessStatusCode();

        var envelope = await httpResponse.Content
            .ReadFromJsonAsync<GraphQLResponse<T>>(JsonOptions, cancellationToken);

        if (envelope?.Errors is { Count: > 0 } errors)
        {
            var messages = string.Join("; ", errors.Select(e => e.Message));
            _logger.LogError("Umbraco Compose GraphQL errors: {Errors}", messages);
            throw new InvalidOperationException($"GraphQL errors: {messages}");
        }

        return envelope is not null ? envelope.Data : default;
    }
}
