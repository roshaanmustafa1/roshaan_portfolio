<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const sectionRef = ref<HTMLElement | null>(null)
const magneticWrappers = ref<HTMLElement[]>([])

// Typewriter
const roles = ['Frontend Engineer', 'UI/UX Designer', 'WordPress Expert', 'Vue & React Dev']
const currentRole = ref('')
const isDeleting = ref(false)
const loopNum = ref(0)
const typingSpeed = ref(150)
let typingInterval: ReturnType<typeof setTimeout>

const type = () => {
  const i = loopNum.value % roles.length
  const fullText = roles[i]
  if (isDeleting.value) {
    currentRole.value = fullText.substring(0, currentRole.value.length - 1)
    typingSpeed.value = 40
  } else {
    currentRole.value = fullText.substring(0, currentRole.value.length + 1)
    typingSpeed.value = 100
  }
  if (!isDeleting.value && currentRole.value === fullText) {
    typingSpeed.value = 1800
    isDeleting.value = true
  } else if (isDeleting.value && currentRole.value === '') {
    isDeleting.value = false
    loopNum.value++
    typingSpeed.value = 300
  }
  typingInterval = setTimeout(type, typingSpeed.value)
}

const handleMagneticMove = (e: MouseEvent, element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  gsap.to(element.children[0], { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: 'power3.out' })
}
const handleMagneticLeave = (element: HTMLElement) => {
  gsap.to(element.children[0], { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
}

onMounted(() => {
  type()

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.3 })

    tl.fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo('.hero-label', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
      .fromTo('.hero-line-1', { y: 130, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3 }, '-=0.5')
      .fromTo('.hero-line-2', { y: 130, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3 }, '-=1.1')
      .fromTo('.hero-meta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, '-=0.6')
      .fromTo('.hero-cta', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.1 }, '-=0.5')

    magneticWrappers.value.forEach(wrapper => {
      wrapper.addEventListener('mousemove', (e) => handleMagneticMove(e, wrapper))
      wrapper.addEventListener('mouseleave', () => handleMagneticLeave(wrapper))
    })
  }, sectionRef.value)

  onUnmounted(() => {
    ctx.revert()
    clearTimeout(typingInterval)
  })
})
</script>

<template>
  <section ref="sectionRef" id="home" class="relative min-h-screen flex flex-col bg-transparent text-white overflow-hidden select-none">
    
    <!-- Deep vignette to focus content, sits above global canvas -->
    <div class="absolute inset-0 z-0 bg-radial-vignette pointer-events-none"></div>

    <!-- Subtle glow source top-left -->
    <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-900/10 blur-[100px] pointer-events-none z-0"></div>

    <!-- Content wrapper — same container as all sections -->
    <div class="relative z-10 container mx-auto px-6 md:px-12 flex flex-col min-h-screen">

      <!-- Top Status Bar -->
      <div class="hero-badge flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-32 pb-10 border-b border-white/10">
        <div class="flex items-center gap-3">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span class="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">Open to Work · Lahore, PK</span>
        </div>
        <div class="flex gap-6 text-xs font-mono tracking-widest text-neutral-600">
          <a href="tel:+923134781894" class="hover:text-neutral-300 transition-colors">+92 313 4781894</a>
          <span>·</span>
          <a href="mailto:roshaanmustafa1@gmail.com" class="hover:text-neutral-300 transition-colors">roshaanmustafa1@gmail.com</a>
        </div>
      </div>

      <!-- Main Content — vertically centered -->
      <div class="flex-grow flex flex-col justify-center py-16 md:py-24">

        <!-- Sub-label -->
        <div class="hero-label mb-8 flex items-center gap-3">
          <div class="h-[1px] w-12 bg-neutral-600"></div>
          <span class="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-neutral-500">Roshaan Mustafa</span>
        </div>

        <!-- Massive typography block -->
        <div class="flex flex-col gap-0 overflow-hidden">
          <div class="overflow-hidden py-2">
            <h1 class="hero-line-1 text-[13vw] md:text-[9vw] xl:text-[8.5rem] font-black uppercase tracking-[-0.03em] leading-[0.87] text-white">
              Developer
            </h1>
          </div>
          <div class="overflow-hidden py-2">
            <h1 class="hero-line-2 text-[13vw] md:text-[9vw] xl:text-[8.5rem] font-black uppercase tracking-[-0.03em] leading-[0.87]" style="color: transparent; -webkit-text-stroke: 1.5px rgba(255,255,255,0.25);">
              & Designer.
            </h1>
          </div>
        </div>

        <!-- Divider line -->
        <div class="hero-meta w-full h-[1px] bg-white/10 my-10"></div>

        <!-- Bottom info row -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          
          <!-- Left: Typewriter + Description -->
          <div class="flex flex-col gap-4 max-w-lg">
            <div class="hero-meta flex items-center gap-3 font-mono text-sm md:text-base text-neutral-300">
              <span class="text-neutral-600 text-xs">[</span>
              <span>{{ currentRole }}</span>
              <span class="inline-flex w-[2px] h-4 bg-white animate-pulse ml-0.5"></span>
              <span class="text-neutral-600 text-xs">]</span>
            </div>
            <p class="hero-meta text-neutral-500 text-sm md:text-base font-light leading-relaxed">
              Passioned about the intersection of <span class="text-neutral-300">elegant UI</span> and <span class="text-neutral-300">high-performance code</span>. Building exceptional web experiences with Vue, React & WordPress since 2020.
            </p>
          </div>

          <!-- Right: CTA Buttons -->
          <div class="flex items-center gap-5 flex-shrink-0">
            <div class="relative inline-block p-5 -m-5 cursor-pointer" :ref="el => { if (el) magneticWrappers.push(el as HTMLElement) }">
              <a href="#projects" class="hero-cta inline-flex items-center gap-3 py-4 px-8 bg-white text-black rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-neutral-100 transition-colors group">
                View Work
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="group-hover:translate-x-1 transition-transform" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
            <div class="relative inline-block p-5 -m-5 cursor-pointer" :ref="el => { if (el) magneticWrappers.push(el as HTMLElement) }">
              <a href="#contact" class="hero-cta inline-flex items-center gap-3 py-4 px-8 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-white/5 transition-colors group">
                Hire Me
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="group-hover:rotate-45 transition-transform duration-300" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
              </a>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom scroll hint -->
      <div class="hero-meta flex justify-center pb-10">
        <div class="flex flex-col items-center gap-2 text-neutral-700 opacity-60">
          <span class="text-[9px] uppercase tracking-[0.3em] font-mono">Scroll</span>
          <div class="w-[1px] h-10 bg-neutral-700 animate-pulse"></div>
        </div>
      </div>
      
    </div>

  </section>
</template>

<style scoped>
.bg-radial-vignette {
  background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.7) 100%);
}
</style>
