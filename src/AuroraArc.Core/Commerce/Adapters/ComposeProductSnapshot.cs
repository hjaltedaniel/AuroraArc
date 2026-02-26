using AuroraArc.Core.Commerce.GraphQL;
using Umbraco.Commerce.Core.Models;

namespace AuroraArc.Core.Commerce.Adapters;

/// <summary>
/// Maps a <see cref="ComposeProduct"/> (from the Umbraco Compose GraphQL API) to
/// Umbraco Commerce's <see cref="IProductSnapshot"/> interface so that Commerce can
/// display and price the product correctly.
/// </summary>
internal sealed class ComposeProductSnapshot : IProductSnapshot
{
    public ComposeProductSnapshot(ComposeProduct product, Guid storeId, Guid defaultCurrencyId)
    {
        var props = product.Properties!; // guaranteed non-null by the adapter

        StoreId = storeId;
        ProductReference = product.Id;
        ProductVariantReference = null;

        Sku = props.Sku ?? product.Id;
        Name = props.ProductName ?? product.Name ?? product.Id;

        // Prices are in major currency units (799 = $799 — NOT cents)
        Prices = new[]
        {
            new ProductPrice(props.BasePrice, defaultCurrencyId),
        };

        TaxClassId = null;
        Attributes = Array.Empty<AttributeCombination>();
        IsGiftCard = false;

        // Build the extra-properties dictionary exposed to Commerce/storefront
        var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        if (props.Sku is not null)           dict["sku"]              = props.Sku;
        if (props.ProductName is not null)   dict["productName"]      = props.ProductName;
        if (props.Status is not null)        dict["status"]           = props.Status;
        if (props.Availability is not null)  dict["availability"]     = props.Availability;
        if (props.Currency is not null)      dict["currency"]         = props.Currency;
        if (props.Materials is not null)     dict["materials"]        = props.Materials;
        if (props.MetaDescription is not null) dict["metaDescription"] = props.MetaDescription;
        if (props.Tags is { Count: > 0 })    dict["tags"]             = string.Join(",", props.Tags);
        if (props.SalePrice > 0)             dict["salePrice"]        = props.SalePrice.ToString("F2");
                                             dict["stockQuantity"]    = props.StockQuantity.ToString();

        Properties = dict;
    }

    public Guid StoreId { get; }
    public string ProductReference { get; }
    public string? ProductVariantReference { get; }
    public string Sku { get; }
    public string Name { get; }
    public IEnumerable<ProductPrice> Prices { get; }
    public Guid? TaxClassId { get; }
    public IEnumerable<AttributeCombination> Attributes { get; }
    public IDictionary<string, string> Properties { get; }
    public bool IsGiftCard { get; }
}
