using AuroraArc.Core.Commerce.GraphQL;
using Umbraco.Commerce.Core.Models;

namespace AuroraArc.Core.Commerce.Adapters;

/// <summary>
/// Maps a <see cref="ComposeProduct"/> to Umbraco Commerce's <see cref="IProductSummary"/>
/// interface, which is used by the product picker in the back-office.
/// </summary>
internal sealed class ComposeProductSummary : IProductSummary
{
    public ComposeProductSummary(ComposeProduct product, Guid defaultCurrencyId)
    {
        var props = product.Properties!; // guaranteed non-null by the adapter

        Reference = product.Id;
        Sku = props.Sku ?? product.Id;
        Name = props.ProductName ?? product.Name ?? product.Id;

        Prices = new[]
        {
            new ProductPrice(props.BasePrice, defaultCurrencyId),
        };

        HasVariants = false;
    }

    public string Reference { get; }
    public string Sku { get; }
    public string Name { get; }
    public IEnumerable<ProductPrice> Prices { get; }
    public bool HasVariants { get; }
}
