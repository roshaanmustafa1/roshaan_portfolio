<script setup lang="ts">
// Main portfolio page
</script>

<template>
  <main class="w-full relative bg-neutral-950">
    <!-- Global animated dot-grid, fixed behind everything -->
    <PageBackground />

    <Navbar />
    
    <HeroSection />
    <LazyAboutSection />
    <LazySkillsSection />
    <LazyExperienceSection />
    <LazyProjectsSection />
    <LazyContactSection />
    
    <LazyFooter />
  </main>
</template>
