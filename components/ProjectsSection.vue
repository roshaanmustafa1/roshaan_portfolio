<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const projectsGrid = ref<HTMLElement | null>(null)

const projects = [
  {
    id: 1,
    title: 'Qamar Medical Center',
    category: 'Healthcare App / WordPress',
    image: '/Projects/QamarMedicalCenter.png',
    link: 'https://qamarmedicalcenter.com'
  },
  {
    id: 2,
    title: 'Sunmax',
    category: 'E-commerce / WordPress',
    image: '/Projects/sunmax.png',
    link: 'https://sunmax.ca'
  },
  {
    id: 3,
    title: 'Cloud Retailer',
    category: 'SaaS / WordPress',
    image: '/Projects/cloudretailer.jpeg',
    link: 'https://cloudretailer.com'
  },
  {
    id: 4,
    title: 'Mandelli',
    category: 'Custom Theme / WordPress',
    image: '/Projects/Mandelli.png',
    link: 'https://mandelli.it'
  },
  {
    id: 5,
    title: 'Wotpods',
    category: 'E-commerce / WordPress',
    image: '/Projects/wotpods.png',
    link: 'https://wotpods.com.au'
  },
  {
    id: 6,
    title: 'Your Mellon',
    category: 'React / Vue',
    image: '/Projects/Your_Mellon.png',
    link: 'https://yourmellon.com'
  },
  {
    id: 7,
    title: 'Deadstock',
    category: 'Vue',
    image: '/Projects/Deadstock.png',
    link: 'https://deadstock.com'
  },
  {
    id: 8,
    title: 'Novanity',
    category: 'Vue',
    image: '/Projects/Novanity.png',
    link: 'https://novanity.com'
  },
  {
    id: 9,
    title: 'Wooftrolly',
    category: 'Vue',
    image: '/Projects/Wooftrolly.png',
    link: 'https://wooftrolly.com'
  },
  {
    id: 10,
    title: 'Black Bullet',
    category: 'Vue',
    image: '/Projects/black_bullet.png',
    link: 'https://blackbullet.com'
  },
  {
    id: 11,
    title: 'Capslock Studios',
    category: 'Vue',
    image: '/Projects/capslock_studios.png',
    link: 'https://capslockstudios.com'
  },
  {
    id: 12,
    title: 'Milkai',
    category: 'Vue',
    image: '/Projects/milkai.png',
    link: 'https://milkai.com'
  },
  {
    id: 13,
    title: 'Rite Us',
    category: 'WordPress',
    image: '/Projects/rite_us.png',
    link: 'https://rite.us'
  },
  {
    id: 14,
    title: 'WSL Consultant',
    category: 'WordPress',
    image: '/Projects/wsl_consultant.png',
    link: 'https://wslconsultant.com'
  }
]

const categories = ['All', 'React', 'Vue', 'WordPress', 'Other']
const activeCategory = ref('All')

const filteredProjects = computed(() => {
  if (activeCategory.value === 'All') return projects
  return projects.filter(p => {
    const cat = p.category.toLowerCase()
    if (activeCategory.value === 'Vue') return cat.includes('vue')
    if (activeCategory.value === 'React') return cat.includes('react')
    if (activeCategory.value === 'WordPress') return cat.includes('wordpress')
    if (activeCategory.value === 'Other') return !cat.includes('vue') && !cat.includes('react') && !cat.includes('wordpress')
    return false
  })
})

let headerCtx: gsap.Context
let itemsCtx: gsap.Context

const initItemsAnimation = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 1024px)').matches) return
  if (itemsCtx) itemsCtx.revert()
  
  itemsCtx = gsap.context(() => {
    if (projectsGrid.value) {
      const items = projectsGrid.value.querySelectorAll('.proj-card')

      items.forEach((item, index) => {
        // Card reveal: clip-path wipe + translation
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: 'top 88%' },
          y: 80, opacity: 0, duration: 1.1,
          ease: 'power4.out',
          delay: (index % 3) * 0.12
        })

        // Image clip-path expand on entry
        const imgWrap = item.querySelector('.proj-img-wrap')
        if (imgWrap) {
          gsap.from(imgWrap, {
            scrollTrigger: { trigger: item, start: 'top 88%' },
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power4.out',
            delay: (index % 3) * 0.12 + 0.1
          })
        }

        // Parallax scrub on image
        const img = item.querySelector('.proj-img')
        if (img) {
          gsap.to(img, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          })
        }

        // Category badge pop
        const badge = item.querySelector('.proj-cat')
        if (badge) {
          gsap.from(badge, {
            scrollTrigger: { trigger: item, start: 'top 88%' },
            scale: 0.7, opacity: 0, duration: 0.4,
            ease: 'back.out(2)', delay: (index % 3) * 0.12 + 0.3
          })
        }
      })
    }
  }, sectionRef.value || undefined)
}

const setFilter = async (cat: string) => {
  if (activeCategory.value === cat) return
  activeCategory.value = cat
  await nextTick()
  initItemsAnimation()
  ScrollTrigger.refresh()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 1024px)').matches) return

  headerCtx = gsap.context(() => {
    // Label slides in from left
    gsap.from('.proj-label', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
      x: -40, opacity: 0, duration: 0.8, ease: 'power3.out'
    })

    // Title sweeps up
    gsap.from('.proj-title', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 78%' },
      y: 60, opacity: 0, duration: 1.1, ease: 'power4.out', delay: 0.15
    })

    // Description line fades
    gsap.from('.proj-desc', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 75%' },
      opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.3
    })
  }, sectionRef.value || undefined)

  initItemsAnimation()
})

onUnmounted(() => {
  if (headerCtx) headerCtx.revert()
  if (itemsCtx) itemsCtx.revert()
})
</script>

<template>
  <section id="projects" ref="sectionRef" class="py-32 relative bg-neutral-950/80 text-white border-t border-white/5 backdrop-blur-[2px]">
    <!-- Section glow -->
    <div class="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>
    
    <div class="container mx-auto px-6 md:px-12 relative z-10 max-w-[1400px]">
      <div class="proj-header mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <span class="proj-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">04 — Selected Works</span>
          <h2 class="proj-title text-4xl md:text-5xl font-black uppercase tracking-tight">Featured Projects</h2>
        </div>
        <p class="proj-desc text-neutral-400 font-light max-w-sm mb-2 md:text-right">
          A highly curated selection of modern digital experiences.
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mb-12">
        <button 
          v-for="cat in categories" :key="cat"
          @click="setFilter(cat)"
          class="px-5 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 border backdrop-blur-[2px]"
          :class="activeCategory === cat ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Updated to 3 columns -->
      <div ref="projectsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 items-start">
        
        <a 
          v-for="project in filteredProjects" 
          :key="project.id"
          :href="project.link"
          target="_blank"
          class="proj-card group block relative cursor-pointer [will-change:transform]"
        >
          <!-- Image Container -->
          <div class="proj-img-wrap overflow-hidden aspect-[4/3] rounded-sm w-full mb-5 bg-neutral-900 border border-white/5 relative">
            <div class="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
            <div class="w-full h-[120%] -mt-[10%]">
              <NuxtImg
                :src="project.image"
                :alt="project.title"
                width="520"
                height="390"
                format="webp"
                quality="75"
                loading="lazy"
                class="proj-img w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition duration-700 group-hover:scale-105 [will-change:transform]"
              />
            </div>
          </div>
          <!-- Text Layer -->
          <div class="flex flex-col gap-1.5 px-2">
            <span class="proj-cat text-neutral-500 tracking-widest text-[10px] md:text-[11px] uppercase font-bold">{{ project.category }}</span>
            <div class="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 class="text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-neutral-300 transition-colors">{{ project.title }}</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </div>
        </a>

      </div>

    </div>
  </section>
</template>
