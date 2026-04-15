<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const colsRef = ref<HTMLElement | null>(null)

const experiences = [
  {
    company: 'Crossmediasol',
    role: 'Frontend Developer',
    period: '2024 – 2026',
    description: 'Spearheaded the development of complex web applications using Vue.js and Nuxt. Implemented responsive designs and optimized application performance, resulting in a 40% improvement in load times.',
  },
  {
    company: 'Softoeaz',
    role: 'Frontend Developer Vue.JS',
    period: '2022 – 2024',
    description: 'Developed and maintained highly customized WordPress themes and plugins. Built custom React components for headless WordPress architectures and mentored junior developers.',
  },
  {
    company: 'Capslock Studios',
    role: 'Wordpress Developer',
    period: '2020 – 2022',
    description: 'Collaborated with designers to translate UI/UX wireframes into functional, interactive web pages. Handled cross-browser compatibility issues and ensured accessibility standards were met.',
  }
]

const education = [
  {
    institution: 'National College of Business Administration and Economics',
    degree: 'Bachelor of Science in Computer Sciences',
    period: '2019 – 2023',
    description: 'Focus on software engineering, web technologies, and algorithms.',
  },
  {
    institution: 'Punjab Colleges',
    degree: 'ICS',
    period: '2016 – 2018',
    description: 'Graduated with honors.',
  },
  {
    institution: 'IT Height',
    degree: 'Wordpress Developer',
    period: '2017 – 2018',
    description: 'Graduated with honors.',
  },
  {
    institution: 'Areena Multimedia',
    degree: 'Graphic Designer',
    period: '2018 – 2019',
    description: 'Graduated with honors.',
  },
  {
    institution: 'Dr Coders',
    degree: 'MERN Stack Developer',
    period: '2022 – 2023',
    description: 'Graduated with honors.',
  }
]

onMounted(() => {
  const ctx = gsap.context(() => {

    // Label + title entry
    gsap.from('.exp-label', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
      x: -40, opacity: 0, duration: 0.8, ease: 'power3.out'
    })
    gsap.from('.exp-title', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 78%' },
      y: 60, opacity: 0, duration: 1.1, ease: 'power4.out', delay: 0.15
    })

    // Column headers slide in from top
    gsap.from('.col-header', {
      scrollTrigger: { trigger: colsRef.value, start: 'top 82%' },
      y: -30, opacity: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out'
    })

    // Each timeline item: slide up with cascading stagger
    if (colsRef.value) {
      const items = colsRef.value.querySelectorAll('.timeline-item')
      items.forEach((item, i) => {
        // Whole card reveal
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: 'top 90%' },
          y: 50, opacity: 0, duration: 0.9,
          ease: 'power3.out'
        })

        // Period badge: scale pop
        const badge = item.querySelector('.period-badge')
        if (badge) {
          gsap.from(badge, {
            scrollTrigger: { trigger: item, start: 'top 88%' },
            scale: 0, opacity: 0, duration: 0.5,
            ease: 'back.out(2.5)', delay: 0.3
          })
        }

        // Role title: slide in from left
        const title = item.querySelector('.item-title')
        if (title) {
          gsap.from(title, {
            scrollTrigger: { trigger: item, start: 'top 88%' },
            x: -30, opacity: 0, duration: 0.7,
            ease: 'power3.out', delay: 0.2
          })
        }

        // Description fade
        const desc = item.querySelector('.item-desc')
        if (desc) {
          gsap.from(desc, {
            scrollTrigger: { trigger: item, start: 'top 88%' },
            y: 20, opacity: 0, duration: 0.8,
            ease: 'power2.out', delay: 0.4
          })
        }
      })
    }

  }, sectionRef.value)

  onUnmounted(() => {
    ctx.revert()
  })
})
</script>

<template>
  <section id="experience" ref="sectionRef" class="py-32 relative bg-black/80 text-white border-t border-white/5 backdrop-blur-[2px]">
    <!-- Section glow -->
    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-900/8 rounded-full blur-[120px] pointer-events-none"></div>
    
    <div class="container mx-auto px-6 md:px-12 relative z-10">
      
      <div class="mb-20 md:mb-24">
        <span class="exp-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">03 — Resume</span>
        <h2 class="exp-title text-4xl md:text-6xl font-black uppercase tracking-tighter">Career & Education</h2>
      </div>

      <div ref="colsRef" class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 border-t border-white/10 pt-12">
        
        <!-- Experience Column -->
        <div class="flex flex-col">
          <h3 class="col-header text-2xl font-bold uppercase tracking-widest text-neutral-400 mb-10 pb-4 border-b border-white/5">Experience</h3>
          
          <div 
            v-for="job in experiences" 
            :key="job.company"
            class="timeline-item group relative border-b border-white/10 pb-10 mb-10 last:border-0 last:pb-0"
          >
            <div class="flex flex-col gap-3">
              <span class="period-badge text-xs uppercase tracking-widest font-bold text-neutral-500 border border-white/10 w-fit px-3 py-1 rounded-full">{{ job.period }}</span>
              <h4 class="item-title text-2xl font-black uppercase tracking-tight text-white mt-2 group-hover:text-white/70 transition-colors">
                {{ job.role }}
              </h4>
              <p class="text-lg text-neutral-400 italic font-serif">{{ job.company }}</p>
              <p class="item-desc text-md text-neutral-500 font-light mt-2 leading-relaxed">{{ job.description }}</p>
            </div>
          </div>
        </div>

        <!-- Education Column -->
        <div class="flex flex-col">
          <h3 class="col-header text-2xl font-bold uppercase tracking-widest text-neutral-400 mb-10 pb-4 border-b border-white/5">Education</h3>
          
          <div 
            v-for="edu in education" 
            :key="edu.institution"
            class="timeline-item group relative border-b border-white/10 pb-10 mb-10 last:border-0 last:pb-0"
          >
            <div class="flex flex-col gap-3">
              <span class="period-badge text-xs uppercase tracking-widest font-bold text-neutral-500 border border-white/10 w-fit px-3 py-1 rounded-full">{{ edu.period }}</span>
              <h4 class="item-title text-2xl font-black uppercase tracking-tight text-white mt-2 group-hover:text-white/70 transition-colors">
                {{ edu.degree }}
              </h4>
              <p class="text-lg text-neutral-400 italic font-serif">{{ edu.institution }}</p>
              <p class="item-desc text-md text-neutral-500 font-light mt-2 leading-relaxed">{{ edu.description }}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
