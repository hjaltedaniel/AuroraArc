using AuroraArc.Core.Commerce.GraphQL;
using AuroraArc.Core.Commerce.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Umbraco.Commerce.Common.Models;
using Umbraco.Commerce.Core.Adapters;
using Umbraco.Commerce.Core.Models;

namespace AuroraArc.Core.Commerce.Adapters;

/// <summary>
/// Umbraco Commerce product adapter that sources products from Umbraco Compose
/// via its GraphQL API.
///
/// Because the Compose API does not support server-side SKU filtering, a full
/// product list is periodically cached in memory (10-minute TTL) and used to
/// resolve SKU→ID lookups without repeated network calls.
/// </summary>
public sealed class ComposeProductAdapter : ProductAdapterBase
{
    private static readonly TimeSpan SkuCacheDuration = TimeSpan.FromMinutes(10);
    private const string SkuCacheKey = "ComposeProductAdapter_SkuMap";

    private readonly ComposeGraphQLClient _graphQLClient;
    private readonly IMemoryCache _memoryCache;
    private readonly ComposeOptions _options;
    private readonly ILogger<ComposeProductAdapter> _logger;

    public ComposeProductAdapter(
        ComposeGraphQLClient graphQLClient,
        IMemoryCache memoryCache,
        IOptions<ComposeOptions> options,
        ILogger<ComposeProductAdapter> logger)
    {
        _graphQLClient = graphQLClient;
        _memoryCache = memoryCache;
        _options = options.Value;
        _logger = logger;
    }

    // ─── ProductAdapterBase abstract methods ──────────────────────────────────

    /// <summary>
    /// Fetches a full product snapshot for Umbraco Commerce to use when calculating
    /// prices, taxes, and other order-line details.
    /// </summary>
    public override async Task<IProductSnapshot?> GetProductSnapshotAsync(
        Guid storeId,
        string productReference,
        string? productVariantReference,
        string languageIsoCode,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var product = await _graphQLClient.GetProductByIdAsync(productReference, cancellationToken);

            if (product is null)
            {
                _logger.LogWarning(
                    "Compose product {ProductReference} not found for store {StoreId}",
                    productReference, storeId);
                return null;
            }

            return new ComposeProductSnapshot(product, storeId, _options.DefaultCurrencyId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to fetch product snapshot for {ProductReference} from Umbraco Compose",
                productReference);
            return null;
        }
    }

    /// <summary>
    /// Resolves a SKU to a (productReference, productVariantReference) tuple.
    /// Uses an in-memory cache of all products to avoid per-lookup API calls,
    /// since the Compose GraphQL API does not support server-side SKU filtering.
    /// </summary>
    public override async Task<Attempt<(string ProductReference, string? ProductVariantReference)>> TryGetProductReferenceAsync(
        Guid storeId,
        string sku,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var skuMap = await GetSkuMapAsync(cancellationToken);

            if (skuMap.TryGetValue(sku, out var productId))
                return Attempt.Succeed<(string, string?)>((productId, null));

            _logger.LogWarning("SKU '{Sku}' not found in Compose product catalog", sku);
            return Attempt.Fail<(string, string?)>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to resolve SKU '{Sku}' from Umbraco Compose", sku);
            return Attempt.Fail<(string, string?)>();
        }
    }

    // ─── Optional override: product summaries for the back-office picker ──────

    /// <summary>
    /// Returns a paged list of product summaries for the Umbraco Commerce
    /// back-office product picker.
    /// </summary>
    public override async Task<PagedResult<IProductSummary>> SearchProductSummariesAsync(
        Guid storeId,
        string languageIsoCode,
        string? query,
        long currentPage = 1,
        long itemsPerPage = 50,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var allProducts = await _graphQLClient.GetAllProductsAsync(cancellationToken);

            // Apply optional in-memory search filter
            IEnumerable<ComposeProduct> filtered = allProducts;
            if (!string.IsNullOrWhiteSpace(query))
            {
                filtered = allProducts.Where(p =>
                    (p.Properties?.ProductName?.Contains(query, StringComparison.OrdinalIgnoreCase) ?? false) ||
                    (p.Properties?.Sku?.Contains(query, StringComparison.OrdinalIgnoreCase) ?? false));
            }

            var filteredList = filtered.ToList();
            long total = filteredList.Count;

            var page = filteredList
                .Skip((int)((currentPage - 1) * itemsPerPage))
                .Take((int)itemsPerPage)
                .Select(p => (IProductSummary)new ComposeProductSummary(p, _options.DefaultCurrencyId))
                .ToList();

            return new PagedResult<IProductSummary>(total, currentPage, itemsPerPage)
            {
                Items = page,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to search product summaries from Umbraco Compose");
            return new PagedResult<IProductSummary>(0, currentPage, itemsPerPage) { Items = [] };
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Returns a cached dictionary mapping SKU → Compose product node ID.
    /// Cache TTL is 10 minutes; invalidated on next request after expiry.
    /// </summary>
    private async Task<Dictionary<string, string>> GetSkuMapAsync(CancellationToken cancellationToken)
    {
        if (_memoryCache.TryGetValue(SkuCacheKey, out Dictionary<string, string>? cached) && cached is not null)
            return cached;

        var allProducts = await _graphQLClient.GetAllProductsAsync(cancellationToken);

        var map = allProducts
            .Where(p => p.Properties?.Sku is not null)
            .ToDictionary(
                p => p.Properties!.Sku!,
                p => p.Id,
                StringComparer.OrdinalIgnoreCase);

        _memoryCache.Set(SkuCacheKey, map, SkuCacheDuration);

        _logger.LogInformation(
            "Compose SKU cache refreshed — {Count} products indexed",
            map.Count);

        return map;
    }
}
