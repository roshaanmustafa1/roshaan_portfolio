<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isEnabled = ref(true)
let animFrame: number
let resizeFrame: number

onMounted(() => {
  if (window.innerWidth < 768) {
    isEnabled.value = false
    return
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const GRID = 48
  interface Dot {
    x: number
    y: number
    baseOpacity: number
    speed: number
    phase: number
  }

  let dots: Dot[] = []

  const buildDots = () => {
    dots = []
    const width = window.innerWidth
    const height = document.body.scrollHeight

    for (let x = 0; x < width + GRID; x += GRID) {
      for (let y = 0; y < height + GRID; y += GRID) {
        dots.push({
          x,
          y,
          baseOpacity: Math.random() * 0.2 + 0.03,
          speed: Math.random() * 0.015 + 0.004,
          phase: Math.random() * Math.PI * 2
        })
      }
    }
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.floor(window.innerWidth * dpr)
    canvas.height = Math.floor(document.body.scrollHeight * dpr)
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${document.body.scrollHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    buildDots()
  }

  const scheduleResize = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(resize)
  }

  resize()

  const ro = new ResizeObserver(scheduleResize)
  ro.observe(document.body)
  window.addEventListener('resize', scheduleResize)

  let isHidden = document.hidden
  
  const handleVisibilityChange = () => {
    isHidden = document.hidden
    if (!isHidden && !reduceMotion && window.innerWidth >= 768) {
      if (animFrame) cancelAnimationFrame(animFrame)
      draw()
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  let t = 0
  const draw = () => {
    if (isHidden) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    t += 0.01

    dots.forEach(dot => {
      const opacity = Math.max(0, Math.min(0.5, dot.baseOpacity + Math.sin(t * dot.speed * 60 + dot.phase) * 0.12))
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, 1.1, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${opacity})`
      ctx.fill()
    })

    if (!reduceMotion) {
      animFrame = requestAnimationFrame(draw)
    }
  }

  draw()

  onUnmounted(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
    ro.disconnect()
    window.removeEventListener('resize', scheduleResize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
})
</script>

<template>
  <canvas
    v-if="isEnabled"
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none z-0"
    style="opacity: 0.55;"
  ></canvas>
</template>
