<template>
  <div class="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30">
    <ScrollProgress />
    <CustomCursor />
    <NuxtPage />
  </div>
</template>

<style>
/* Smooth scrolling global */
html {
  scroll-behavior: smooth;
}
</style>
