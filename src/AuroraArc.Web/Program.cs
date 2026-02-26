using AuroraArc.Core.Commerce.Adapters;
using AuroraArc.Core.Commerce.Client;
using AuroraArc.Core.Commerce.GraphQL;
using AuroraArc.Core.Commerce.Options;
using Umbraco.Commerce.Core.Adapters;
using Umbraco.Commerce.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// ─── Umbraco Compose options ──────────────────────────────────────────────────
builder.Services.Configure<ComposeOptions>(
    builder.Configuration.GetSection(ComposeOptions.SectionName));

// ─── HTTP client infrastructure ───────────────────────────────────────────────
builder.Services.AddHttpClient("ComposeAuth");
builder.Services.AddHttpClient("ComposeGraphQL");

// ─── In-memory cache (used by ComposeProductAdapter for SKU lookups) ──────────
builder.Services.AddMemoryCache();

// ─── Compose service layer ────────────────────────────────────────────────────
builder.Services.AddSingleton<ComposeTokenService>();
builder.Services.AddSingleton<ComposeGraphQLClient>();

// ─── Umbraco ──────────────────────────────────────────────────────────────────
builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddUmbracoCommerce(commerceBuilder =>
    {
        commerceBuilder.AddSQLite();
        commerceBuilder.AddStorefrontApi();

        // Replace the default Umbraco CMS product adapter with the Compose adapter
        commerceBuilder.Services.AddUnique<IProductAdapter, ComposeProductAdapter>();
    })
    .AddDeliveryApi()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();

app.UseHttpsRedirection();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();
