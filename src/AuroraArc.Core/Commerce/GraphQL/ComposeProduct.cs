using System.Text.Json.Serialization;

namespace AuroraArc.Core.Commerce.GraphQL;

// ReSharper disable ClassNeverInstantiated.Global

// ─── GraphQL envelope ────────────────────────────────────────────────────────

internal sealed class GraphQLRequest
{
    [JsonPropertyName("query")]
    public string Query { get; set; } = string.Empty;
}

internal sealed class GraphQLResponse<T>
{
    [JsonPropertyName("data")]
    public T? Data { get; set; }

    [JsonPropertyName("errors")]
    public List<GraphQLError>? Errors { get; set; }
}

internal sealed class GraphQLError
{
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}

// ─── products query types ────────────────────────────────────────────────────

internal sealed class ProductsData
{
    [JsonPropertyName("products")]
    public ProductConnection? Products { get; set; }
}

internal sealed class ProductConnection
{
    [JsonPropertyName("items")]
    public List<ComposeProduct>? Items { get; set; }
}

/// <summary>
/// Represents a node returned from the <c>products</c> GraphQL query.
/// Items that are not typed as <c>Product</c> will have a null <see cref="Properties"/>.
/// </summary>
internal sealed class ComposeProduct
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    /// <summary>Display name — only populated for Product-typed nodes.</summary>
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>Strongly typed product properties — null for non-Product nodes.</summary>
    [JsonPropertyName("properties")]
    public ComposeProductProperties? Properties { get; set; }
}

internal sealed class ComposeProductProperties
{
    [JsonPropertyName("sku")]
    public string? Sku { get; set; }

    [JsonPropertyName("productName")]
    public string? ProductName { get; set; }

    /// <summary>Base (regular) price in major currency units (e.g. 799 = $799).</summary>
    [JsonPropertyName("basePrice")]
    public decimal BasePrice { get; set; }

    /// <summary>Sale price in major currency units; 0 or null means no active sale price.</summary>
    [JsonPropertyName("salePrice")]
    public decimal SalePrice { get; set; }

    [JsonPropertyName("currency")]
    public string? Currency { get; set; }

    [JsonPropertyName("stockQuantity")]
    public int StockQuantity { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("availability")]
    public string? Availability { get; set; }

    /// <summary>Tags returned as a JSON array from Compose.</summary>
    [JsonPropertyName("tags")]
    public List<string>? Tags { get; set; }

    [JsonPropertyName("materials")]
    public string? Materials { get; set; }

    [JsonPropertyName("metaDescription")]
    public string? MetaDescription { get; set; }
}
