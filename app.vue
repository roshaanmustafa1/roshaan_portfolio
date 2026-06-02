<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isLoading = ref(true)
const loadProgress = ref(0)

let progressTimer: number | undefined
let completeTimer: number | undefined
let hideTimer: number | undefined
let completeInterval: number | undefined

let startedAt = 0
let hasFinished = false
let previousBodyOverflow = ''

const MIN_LOADER_TIME = 1400
const EXIT_DELAY = 320

const finishLoading = () => {
  if (hasFinished) return

  hasFinished = true

  if (progressTimer) {
    window.clearInterval(progressTimer)
  }

  const elapsed = performance.now() - startedAt
  const remaining = Math.max(MIN_LOADER_TIME - elapsed, 0)

  completeTimer = window.setTimeout(() => {
    completeInterval = window.setInterval(() => {
      if (loadProgress.value >= 100) {
        window.clearInterval(completeInterval)

        hideTimer = window.setTimeout(() => {
          isLoading.value = false
          document.body.style.overflow = previousBodyOverflow
        }, EXIT_DELAY)

        return
      }

      loadProgress.value = Math.min(loadProgress.value + 1, 100)
    }, 20)
  }, remaining)
}

onMounted(() => {
  startedAt = performance.now()

  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  progressTimer = window.setInterval(() => {
    if (loadProgress.value >= 92) return

    const increment =
      loadProgress.value < 60 ? 4 : loadProgress.value < 80 ? 2 : 1

    loadProgress.value = Math.min(loadProgress.value + increment, 92)
  }, 90)

  if (document.readyState === 'complete') {
    finishLoading()
  } else {
    window.addEventListener('load', finishLoading, { once: true })
  }
})

onUnmounted(() => {
  if (progressTimer) window.clearInterval(progressTimer)
  if (completeTimer) window.clearTimeout(completeTimer)
  if (hideTimer) window.clearTimeout(hideTimer)
  if (completeInterval) window.clearInterval(completeInterval)

  window.removeEventListener('load', finishLoading)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary/30">
    <SiteLoader v-if="isLoading" :progress="loadProgress" />

    <div
      v-if="!isLoading"
      :class="[
        'animate-site-ready',
        'opacity-100'
      ]"
    >
      <ScrollProgress />
      <CustomCursor />
      <ScrollToTop />

      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

.animate-site-ready {
  animation: site-ready 320ms ease-out both;
}

@keyframes site-ready {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
