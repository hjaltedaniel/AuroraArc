<template>
  <main>
    <h1>Product Search</h1>
    
    <ais-instant-search
      :search-client="searchClient"
      index-name="AuroraArc"
    >
      <ais-search-box />
      <ais-hits>
        <template v-slot:item="{ item }">
          <NuxtLink :to="`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`" class="product">
            <h2>{{ item.name }}</h2>
          </NuxtLink>
        </template>
      </ais-hits>
    </ais-instant-search>
  </main>
</template>

<script setup>
import { algoliasearch } from 'algoliasearch';
import { AisInstantSearch, AisSearchBox, AisHits } from 'vue-instantsearch/vue3/es';

const rawClient = algoliasearch('R55NZS8KGD', '622e4e9e66d9bf9a8c9b2cd3462919c6');

// Only search when the user has typed something
const searchClient = {
  ...rawClient,
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({ results: requests.map(() => ({ hits: [], nbHits: 0, nbPages: 0, page: 0, processingTimeMS: 0 })) });
    }
    return rawClient.search(requests);
  },
};
</script>

<style>
@import 'instantsearch.css/themes/satellite-min.css';
</style>