import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    // Umbraco Compose (GraphQL content)
    composeGraphqlEndpoint: process.env.COMPOSE_GRAPHQL_ENDPOINT || 'https://graphql.germanywestcentral.umbracocompose.com/hjalte/production',
    composeClientId: process.env.COMPOSE_CLIENT_ID || '',
    composeClientSecret: process.env.COMPOSE_CLIENT_SECRET || '',
    composeTokenEndpoint: process.env.COMPOSE_TOKEN_ENDPOINT || 'https://management.umbracocompose.com/v1/auth/token',
    // Umbraco Commerce (Storefront REST)
    commerceApiBase: process.env.COMMERCE_API_BASE || 'https://dev-aurora-arc.euwest01.umbraco.io/umbraco/commerce/storefront/api/v1',
    commerceApiKey:  process.env.COMMERCE_API_KEY  || 'a7F9kLm2Qx8ZpR4vT6yBn3HdW0sJcE5U',
  },

  // Disable subdirectory prefix so ui/ArcButton.vue → ArcButton (not UiArcButton).
  // All filenames already carry their own semantic prefix (Arc*, Layout*, Product*, Landing*)
  // so stripping the directory prefix loses nothing and avoids mismatches in templates.
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],

  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600, 700, 800],
    },
    display: 'swap',
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  app: {
    head: {
      title: 'Aurora Arc - Expedition Gear for the Connected Explorer',
      meta: [
        { name: 'description', content: 'Precision expedition gear fusing cutting-edge tech with rugged field performance. Navigate beyond.' },
        { name: 'theme-color', content: '#0B1026' },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
})
