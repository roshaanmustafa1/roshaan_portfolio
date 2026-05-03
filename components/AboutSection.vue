<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const colsRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return

  const ctx = gsap.context(() => {

    // Header: clip-path reveal + label slide
    gsap.from('.about-label', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
      xPercent: -30, opacity: 0, duration: 0.7, ease: 'power3.out'
    })
    gsap.from('.about-title', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 78%' },
      y: 60, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.1
    })

    // Divider line width animation
    gsap.from('.about-divider', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 75%' },
      scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power4.inOut', delay: 0.3
    })

    // Left column image reveal via clip-path
    gsap.from('.about-img-container', {
      scrollTrigger: { trigger: '.about-img-container', start: 'top 85%' },
      clipPath: 'inset(100% 0% 0% 0%)',
      opacity: 0,
      duration: 1.4,
      ease: 'power4.out'
    })

    // Image parallax scrub
    gsap.to('.about-img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-img-container',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })

    // Right text blocks stagger
    gsap.from('.about-reveal', {
      scrollTrigger: { trigger: colsRef.value, start: 'top 82%' },
      y: 50, opacity: 0, duration: 1, stagger: 0.18, ease: 'power3.out'
    })

    // Animated stat counters
    const statEls = document.querySelectorAll('.stat-count')
    statEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0')
      gsap.fromTo(el, { textContent: 0 }, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        textContent: target,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        onUpdate: function () {
          (el as HTMLElement).textContent = Math.round(parseFloat((el as HTMLElement).textContent || '0')) + '+'
        }
      })
    })

  }, sectionRef.value)

  onUnmounted(() => {
    ctx.revert()
  })
})
</script>

<template>
  <section id="about" ref="sectionRef" class="py-32 relative bg-black/80 text-white border-t border-white/5 backdrop-blur-[2px]">
    <!-- Section glow accent -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-900/8 rounded-full blur-[100px] pointer-events-none"></div>
    
    <div class="container mx-auto px-6 md:px-12 relative z-10">
      
      <div class="mb-16 md:mb-24">
        <span class="about-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">01 — Profile</span>
        <h2 class="about-title text-4xl md:text-5xl font-black uppercase tracking-tight">About Me</h2>
        <div class="about-divider mt-6 h-[1px] bg-white/10 w-full"></div>
      </div>

      <div ref="colsRef" class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        <!-- Portrait Image Mask -->
        <div class="about-reveal lg:col-span-5 w-full">
          <!-- Placeholder for user's portrait image -->
          <div class="about-img-container overflow-hidden w-full aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] border border-white/10 bg-neutral-900 relative">
            <div class="absolute inset-0 flex items-center justify-center opacity-30 flex-col gap-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span class="text-xs uppercase tracking-widest font-bold font-mono">Insert Portrait</span>
            </div>
            <!-- When the user adds their image, it parallax scrubs internally -->
            <NuxtImg
              src="/Roshaan.png"
              alt="Roshaan Mustafa portrait"
              width="640"
              height="800"
              format="webp"
              quality="75"
              loading="lazy"
              class="about-img w-full h-[120%] -mt-[10%] object-cover grayscale"
            />
          </div>
        </div>

        <!-- Bio Content -->
        <div class="lg:col-span-7 flex flex-col gap-10">
          
          <div class="flex flex-col gap-6 about-reveal">
            <h3 class="text-3xl md:text-5xl font-black leading-tight tracking-tighter uppercase">
              Engineering with <br/><span class="text-neutral-500">Aesthetic Precision.</span>
            </h3>
            <div class="w-20 h-1 bg-white/20"></div>
            <p class="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
              I am a passionate <strong class="text-white font-normal">Frontend Engineer & Web Designer</strong> driven by the desire to build highly optimized, visually stunning digital experiences. 
            </p>
            <p class="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
              From sophisticated headless React architectures to pixel-perfect WordPress theme developments, my focus remains constant: ensuring blazing-fast performance without compromising on high-end design aesthetics. 
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-6 about-reveal pt-8 border-t border-white/10">
            <div class="flex flex-col gap-2">
              <span class="stat-count text-5xl font-black tracking-tighter text-white" data-target="3">3+</span>
              <span class="text-xs uppercase tracking-widest text-neutral-500 font-bold">Years Exp.</span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="stat-count text-5xl font-black tracking-tighter text-white" data-target="30">30+</span>
              <span class="text-xs uppercase tracking-widest text-neutral-500 font-bold">Projects</span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-5xl font-black tracking-tighter text-white">100%</span>
              <span class="text-xs uppercase tracking-widest text-neutral-500 font-bold">Commitment</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
