<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const cursor = ref<HTMLElement | null>(null)
const dot = ref<HTMLElement | null>(null)
const isHovering = ref(false)
let canUseCustomCursor = false
let lastDomQueryTime = 0
let cursorFrame = 0
let mouseX = 0
let mouseY = 0

const moveCursor = () => {
  cursorFrame = 0

  gsap.to(dot.value, {
    x: mouseX,
    y: mouseY,
    duration: 0,
  })

  gsap.to(cursor.value, {
    x: mouseX,
    y: mouseY,
    duration: 0.15,
    ease: 'power2.out'
  })
}

const updateCursor = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY

  if (!cursorFrame) {
    cursorFrame = requestAnimationFrame(moveCursor)
  }

  // Throttle heavy DOM querying to ~10 times per second
  const now = Date.now()
  if (now - lastDomQueryTime > 100) {
    lastDomQueryTime = now
    
    // Detect hover on interactive elements
    const target = e.target as HTMLElement
    const isInteractive = target.closest('a, button, [role="button"], input, textarea, .magnetic-btn')
    
    if (isInteractive && !isHovering.value) {
      isHovering.value = true
      gsap.to(cursor.value, { scale: 1.5, borderColor: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: 0.3 })
      gsap.to(dot.value, { scale: 0, duration: 0.3 })
    } else if (!isInteractive && isHovering.value) {
      isHovering.value = false
      gsap.to(cursor.value, { scale: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'transparent', duration: 0.3 })
      gsap.to(dot.value, { scale: 1, duration: 0.3 })
    }
  }
}

onMounted(() => {
  canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!canUseCustomCursor) return

  // Ensure the cursor is visible and global cursor is hidden
  document.body.style.cursor = 'none'
  
  window.addEventListener('mousemove', updateCursor)
  
  // Initially center and reveal
  gsap.set([cursor.value, dot.value], { x: window.innerWidth / 2, y: window.innerHeight / 2, opacity: 0 })
  window.addEventListener('mousemove', () => {
    gsap.to([cursor.value, dot.value], { opacity: 1, duration: 0.5 })
  }, { once: true })
})

onUnmounted(() => {
  if (canUseCustomCursor) {
    if (cursorFrame) cancelAnimationFrame(cursorFrame)
    window.removeEventListener('mousemove', updateCursor)
    document.body.style.cursor = 'auto'
  }
})
</script>

<template>
  <div class="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
    <!-- Outer trailing circle -->
    <div 
      ref="cursor"
      class="fixed top-0 left-0 w-10 h-10 rounded-full border border-white/40 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[10000]"
    ></div>
    <!-- Inner immediate dot -->
    <div 
      ref="dot"
      class="fixed top-0 left-0 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[10001]"
    ></div>
  </div>
</template>

<style>
/* Fallback to hide cursor globally when CustomCursor is active */
@media (min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  * {
    cursor: none !important;
  }
}
</style>
