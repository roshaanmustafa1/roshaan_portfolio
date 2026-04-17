<template>
  <div class="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 overflow-x-hidden">
    <ScrollProgress />
    <CustomCursor />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Smooth scrolling global */
html {
  scroll-behavior: smooth;
}
</style>
