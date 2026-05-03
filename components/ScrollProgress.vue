<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollProgress = ref(0)
let ticking = false
let cachedMaxScroll = 0
let resizeObserver: ResizeObserver | null = null

const calculateMaxScroll = () => {
  cachedMaxScroll = document.documentElement.scrollHeight - window.innerHeight
}

const updateScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const scrollPosition = window.scrollY
    scrollProgress.value = cachedMaxScroll > 0 ? (scrollPosition / cachedMaxScroll) * 100 : 0
    ticking = false
  })
}

onMounted(() => {
  calculateMaxScroll()
  resizeObserver = new ResizeObserver(calculateMaxScroll)
  resizeObserver.observe(document.documentElement)
  resizeObserver.observe(document.body)
  window.addEventListener('resize', calculateMaxScroll, { passive: true })
  window.addEventListener('scroll', updateScroll, { passive: true })
  updateScroll()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', calculateMaxScroll)
  window.removeEventListener('scroll', updateScroll)
})
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
    <div 
      class="h-full bg-primary origin-left transition-all duration-100 ease-out"
      :style="{ width: `${scrollProgress}%` }"
    ></div>
  </div>
</template>
