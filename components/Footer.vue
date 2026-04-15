<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const footerRef = ref<HTMLElement | null>(null)
const time = ref('')
let timer: ReturnType<typeof setInterval>

const updateTime = () => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
  time.value = formatter.format(new Date())
}

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)

  await nextTick()
  const ctx = gsap.context(() => {
    if (!footerRef.value) return

    // CTA Title slide
    gsap.from('.footer-title', {
      scrollTrigger: { trigger: footerRef.value, start: 'top 90%' },
      y: 40, opacity: 0, duration: 1, ease: 'power3.out'
    })

    // Email link reveal
    gsap.from('.footer-email', {
      scrollTrigger: { trigger: footerRef.value, start: 'top 88%' },
      y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.3
    })

    // Staggered column reveals
    gsap.from('.footer-reveal', {
      scrollTrigger: { trigger: footerRef.value, start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.5
    })

  }, footerRef.value)

  onUnmounted(() => {
    ctx.revert()
    clearInterval(timer)
  })
})

const year = new Date().getFullYear()
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer ref="footerRef" class="bg-neutral-950/85 text-white relative overflow-hidden pt-20 pb-10 border-t border-white/10 backdrop-blur-[2px]">
    <!-- Footer glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-violet-900/8 rounded-full blur-[80px] pointer-events-none"></div>
    <div class="container mx-auto px-6 md:px-12 relative z-10">
      
      <!-- Top Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        
        <!-- Call to Action -->
        <div class="lg:col-span-2 flex flex-col gap-6 pr-8">
          <h2 class="footer-title text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
            Ready to build <br/> something epic?
          </h2>
          <a href="mailto:roshaanmustafa1@gmail.com" class="footer-email text-lg md:text-2xl font-light text-neutral-400 hover:text-white transition-colors border-b border-white/20 w-fit pb-1">
            roshaanmustafa1@gmail.com
          </a>
        </div>

        <!-- Links Box -->
        <div class="footer-reveal flex flex-col gap-6">
          <span class="text-xs font-bold uppercase tracking-widest text-neutral-600">Socials</span>
          <div class="flex flex-col gap-3">
            <a href="https://linkedin.com/in/roshaan-moeez-mustafa-547611231" target="_blank" class="text-sm font-bold uppercase tracking-widest text-white hover:text-neutral-400 transition-colors">LinkedIn</a>
            <a href="https://roshaanmustafa.com" target="_blank" class="text-sm font-bold uppercase tracking-widest text-white hover:text-neutral-400 transition-colors">Website</a>
            <a href="#projects" class="text-sm font-bold uppercase tracking-widest text-white hover:text-neutral-400 transition-colors">Works</a>
          </div>
        </div>

        <!-- Time & Loc -->
        <div class="footer-reveal flex flex-col gap-6">
          <span class="text-xs font-bold uppercase tracking-widest text-neutral-600">Location</span>
          <div class="flex flex-col gap-2">
            <span class="text-sm font-bold uppercase tracking-widest text-white block">Lahore, Pakistan</span>
            <span class="text-sm font-mono tracking-widest text-neutral-400 block">{{ time }}</span>
          </div>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-6">
        <span class="text-xs font-bold uppercase tracking-widest text-neutral-600 w-full text-center md:text-left">
          &copy; {{ year }} Roshaan Mustafa. 
        </span>
        
        <button @click="scrollToTop" class="text-xs font-bold uppercase tracking-widest text-white hover:text-neutral-400 transition-colors flex items-center gap-2 group w-full md:w-auto justify-center md:justify-end">
          <span class="group-hover:-translate-y-1 transition-transform w-max">Back to top</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="group-hover:-translate-y-1 transition-transform"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </button>
      </div>

    </div>
  </footer>
</template>
