<template>
  <div class="flex flex-col min-h-screen">
    <LayoutHeader />
    <main class="flex-1 pt-16">
      <slot />
    </main>
    <LayoutFooter />
    <LayoutCartDrawer />
  </div>
</template>
