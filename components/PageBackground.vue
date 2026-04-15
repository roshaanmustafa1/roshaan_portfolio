<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrame: number

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = document.body.scrollHeight
  }
  resize()

  const ro = new ResizeObserver(resize)
  ro.observe(document.body)
  window.addEventListener('resize', resize)

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
    for (let x = 0; x < canvas.width + GRID; x += GRID) {
      for (let y = 0; y < canvas.height + GRID; y += GRID) {
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

  buildDots()

  let t = 0
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    t += 0.01

    dots.forEach(dot => {
      const opacity = Math.max(0, Math.min(0.5, dot.baseOpacity + Math.sin(t * dot.speed * 60 + dot.phase) * 0.12))
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, 1.1, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${opacity})`
      ctx.fill()
    })

    animFrame = requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animFrame)
    ro.disconnect()
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none z-0"
    style="opacity: 0.55;"
  ></canvas>
</template>
