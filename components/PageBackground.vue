<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isEnabled = ref(true)

onMounted(() => {
  if (window.innerWidth < 768) {
    isEnabled.value = false
    return
  }

  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const GRID = 48
  const DOT_RADIUS = 1.1

  // Deterministic per-dot values so dots keep their look while the grid scrolls
  const hash = (a: number, b: number, salt: number) => {
    const s = Math.sin(a * 127.1 + b * 311.7 + salt * 74.7) * 43758.5453
    return s - Math.floor(s)
  }

  let width = 0
  let height = 0
  let rafId = 0
  let t = 0
  let isHidden = document.hidden

  // The canvas only covers the viewport (fixed). The dot grid is offset by scrollY,
  // so it looks identical to the old full-page canvas without a giant texture.
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const draw = () => {
    rafId = requestAnimationFrame(draw)
    if (isHidden) return
    t += 0.01

    const scrollY = window.scrollY
    const firstRow = Math.floor(scrollY / GRID)
    const offsetY = firstRow * GRID - scrollY

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#fff'

    let col = 0
    for (let x = 0; x < width + GRID; x += GRID, col++) {
      let row = firstRow
      for (let y = offsetY; y < height + GRID; y += GRID, row++) {
        const baseOpacity = hash(col, row, 1) * 0.2 + 0.03
        const speed = hash(col, row, 2) * 0.015 + 0.004
        const phase = hash(col, row, 3) * Math.PI * 2
        const opacity = Math.max(0, Math.min(0.5, baseOpacity + Math.sin(t * speed * 60 + phase) * 0.12))
        ctx.globalAlpha = opacity
        ctx.beginPath()
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }

  const handleVisibilityChange = () => {
    isHidden = document.hidden
  }

  resize()
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)
  rafId = requestAnimationFrame(draw)

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
})
</script>

<template>
  <canvas
    v-if="isEnabled"
    ref="canvasRef"
    class="fixed inset-0 w-full h-full pointer-events-none z-0"
    style="opacity: 0.55;"
  ></canvas>
</template>
