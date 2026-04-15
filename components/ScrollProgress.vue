<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollProgress = ref(0)

const updateScroll = () => {
  const scrollPosition = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollPosition / maxScroll) * 100
}

onMounted(() => {
  window.addEventListener('scroll', updateScroll)
  updateScroll()
})

onUnmounted(() => {
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
