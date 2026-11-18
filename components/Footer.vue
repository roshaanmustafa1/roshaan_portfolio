<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { Linkedin, Mail, Phone, Download, ArrowUp, ArrowUpRight } from 'lucide-vue-next'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const footerRef = ref<HTMLElement | null>(null)
const time = ref('')
let timer: ReturnType<typeof setInterval>
let ctx: gsap.Context | null = null

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/roshaan-moeez-mustafa-547611231', icon: Linkedin, external: true },
  { label: 'Email', href: 'mailto:roshaanmustafa1@gmail.com', icon: Mail, external: false },
  { label: 'Phone', href: 'tel:+923134781894', icon: Phone, external: false },
  { label: 'Download Resume', href: '/roshaan-mustafa-resume.pdf', icon: Download, external: false, download: true },
]

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
  ctx = gsap.context(() => {
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
  }, footerRef.value || undefined)
})

onUnmounted(() => {
  ctx?.revert()
  ctx = null
  clearInterval(timer)
})

const year = new Date().getFullYear()
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer ref="footerRef" class="bg-black/90 text-white relative overflow-hidden pt-24 pb-8 border-t border-white/5">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-indigo-900/15 rounded-full blur-[110px] pointer-events-none"></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10">

      <!-- Centered CTA -->
      <div class="flex flex-col items-center text-center gap-8 pb-20">
        <span class="footer-title text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-500">
          Have a project in mind?
        </span>
        <h2 class="footer-title text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95]">
          Let's work <span class="text-neutral-500">together.</span>
        </h2>
        <a
          href="mailto:roshaanmustafa1@gmail.com"
          class="footer-email group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-neutral-200 transition-colors"
        >
          Say hello
          <ArrowUpRight class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" :stroke-width="2.5" />
        </a>
        <span class="text-sm text-neutral-500 font-light">roshaanmustafa1@gmail.com</span>
      </div>

      <!-- Nav + social row -->
      <div class="footer-reveal flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-y border-white/10">
        <nav class="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >{{ link.label }}</a>
        </nav>

        <div class="flex items-center gap-3">
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            :download="link.download ? '' : undefined"
            :aria-label="link.label"
            :title="link.label"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <component :is="link.icon" class="h-4 w-4" :stroke-width="2" />
          </a>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer-reveal flex flex-col md:flex-row items-center justify-between gap-5 pt-8">
        <span class="text-[11px] font-bold uppercase tracking-widest text-neutral-600">
          &copy; {{ year }} Roshaan Mustafa
        </span>

        <span class="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
          Lahore, PK · {{ time }}
        </span>

        <button
          @click="scrollToTop"
          class="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          aria-label="Back to top"
        >
          Back to top
          <ArrowUp class="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1" :stroke-width="2.5" />
        </button>
      </div>

    </div>
  </footer>
</template>
