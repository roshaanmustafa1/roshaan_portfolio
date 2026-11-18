<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const projectsGrid = ref<HTMLElement | null>(null)

const projectsList = [
  {
    id: 1,
    title: 'Qamar Medical Center',
    category: 'Healthcare App / WordPress',
    image: '/Projects/QamarMedicalCenter.webp',
    link: 'https://qamarmedicalcenter.com'
  },
  {
    id: 2,
    title: 'Sunmax',
    category: 'E-commerce / WordPress',
    image: '/Projects/sunmax.webp',
    link: 'https://sunmax.ca'
  },
  {
    id: 3,
    title: 'Cloud Retailer',
    category: 'SaaS / WordPress',
    image: '/Projects/cloudretailer.webp',
    link: 'https://cloudretailer.com'
  },
  {
    id: 4,
    title: 'Mandelli',
    category: 'Custom Theme / WordPress',
    image: '/Projects/Mandelli.webp',
    link: 'https://mandelli.it'
  },
  {
    id: 5,
    title: 'Wotpods',
    category: 'E-commerce / WordPress',
    image: '/Projects/wotpods.webp',
    link: 'https://wotpods.com.au'
  },
  {
    id: 6,
    title: 'Your Mellon',
    category: 'React / Vue',
    image: '/Projects/Your_Mellon.webp',
    link: 'https://yourmellon.com'
  },
  {
    id: 7,
    title: 'Deadstock',
    category: 'Vue',
    image: '/Projects/Deadstock.webp',
    link: 'https://deadstock.com'
  },
  {
    id: 8,
    title: 'Novanity',
    category: 'Vue',
    image: '/Projects/Novanity.webp',
    link: 'https://novanity.com'
  },
  {
    id: 9,
    title: 'Wooftrolly',
    category: 'Vue',
    image: '/Projects/Wooftrolly.webp',
    link: 'https://wooftrolly.com'
  },
  {
    id: 10,
    title: 'Black Bullet',
    category: 'Vue',
    image: '/Projects/black_bullet.webp',
    link: 'https://blackbullet.com'
  },
  {
    id: 11,
    title: 'Capslock Studios',
    category: 'Vue',
    image: '/Projects/capslock_studios.webp',
    link: 'https://capslockstudios.com'
  },
  {
    id: 12,
    title: 'Milkai',
    category: 'Vue',
    image: '/Projects/milkai.webp',
    link: 'https://milkai.com'
  },
  {
    id: 13,
    title: 'Rite Us',
    category: 'WordPress',
    image: '/Projects/rite_us.webp',
    link: 'https://rite.us'
  },
  {
    id: 14,
    title: 'WSL Consultant',
    category: 'WordPress',
    image: '/Projects/wsl_consultant.webp',
    link: 'https://wslconsultant.com'
  },
  {
    id: 15,
    title: 'ARM Cont',
    category: 'Corporate / WordPress',
    image: '/Projects/arm_cont.webp',
    link: 'https://armcont.com/'
  },
  {
    id: 16,
    title: 'Refine Global Services',
    category: 'Next.js / React',
    image: '/Projects/refine_global_services.webp',
    link: 'https://refine-global-services.vercel.app/'
  },
  {
    id: 17,
    title: 'Vitasalva',
    category: 'Vue / Nuxt',
    image: '/Projects/vitasalva.webp',
    link: 'https://vitasalva.vercel.app/en'
  },
  {
    id: 18,
    title: 'Supply Intelligence',
    category: 'Next.js / React',
    image: '/Projects/supply_intelligence.webp',
    link: 'https://supplyintelligence-beta.vercel.app/'
  },
  {
    id: 19,
    title: 'Faizan Karamat',
    category: 'Next.js / React',
    image: '/Projects/faizan_profile.webp',
    link: 'https://faizan-profile.vercel.app/'
  },
  {
    id: 20,
    title: 'Ramz Mustafa',
    category: 'Next.js / React',
    image: '/Projects/ramz_portfolio.webp',
    link: 'https://ramz-portfolio.vercel.app/'
  },
  {
    id: 21,
    title: '3D Model Maker',
    category: 'Vue / Three.js',
    image: '/Projects/model_maker.webp',
    link: 'https://3d-model-maker-swart.vercel.app/'
  },
  {
    id: 22,
    title: 'LogoPack Studio',
    category: 'Vue',
    image: '/Projects/logo_variations.webp',
    link: 'https://logovariations.vercel.app/'
  }
]

// Latest projects first (highest id on top)
const projects = [...projectsList].sort((a, b) => b.id - a.id)

const categories = ['All', 'React', 'Next.js', 'Vue', 'Nuxt', 'WordPress', 'Other']
const activeCategory = ref('All')

const matchesCategory = (project: { category: string }, cat: string) => {
  const c = project.category.toLowerCase()
  const isKnown = ['vue', 'nuxt', 'react', 'next', 'wordpress'].some(k => c.includes(k))
  switch (cat) {
    case 'All': return true
    case 'Vue': return c.includes('vue')
    case 'Nuxt': return c.includes('nuxt')
    case 'React': return c.includes('react')
    case 'Next.js': return c.includes('next')
    case 'WordPress': return c.includes('wordpress')
    case 'Other': return !isKnown
    default: return false
  }
}

const categoryCounts = computed(() =>
  Object.fromEntries(categories.map(cat => [cat, projects.filter(p => matchesCategory(p, cat)).length]))
)

const filteredProjects = computed(() => projects.filter(p => matchesCategory(p, activeCategory.value)))

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

let headerCtx: gsap.Context
let itemsCtx: gsap.Context

const initItemsAnimation = () => {
  if (itemsCtx) itemsCtx.revert()
  
  itemsCtx = gsap.context(() => {
    if (projectsGrid.value) {
      const items = projectsGrid.value.querySelectorAll('.proj-card')

      items.forEach((item, index) => {
        // One ScrollTrigger per card (card reveal + image clip-path + badge pop)
        const d = (index % 3) * 0.12
        const imgWrap = item.querySelector('.proj-img-wrap')
        const badge = item.querySelector('.proj-cat')
        const revealTl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 88%', once: true }
        })

        // Card reveal: translation
        revealTl.from(item, { y: 80, opacity: 0, duration: 1.1, ease: 'power4.out' }, d)

        // Image clip-path expand on entry
        if (imgWrap) {
          revealTl.from(imgWrap, {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power4.out'
          }, d + 0.1)
        }

        // Category badge pop
        if (badge) {
          revealTl.from(badge, {
            scale: 0.7, opacity: 0, duration: 0.4,
            ease: 'back.out(2)'
          }, d + 0.3)
        }

        // Parallax scrub on image
        const img = item.querySelector('.proj-img')
        if (img) {
          // Subtle zoom-out parallax; image is fully visible by mid-screen
          gsap.fromTo(img, { scale: 1.06 }, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'center center',
              scrub: true
            }
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
  <section id="projects" ref="sectionRef" class="py-32 relative bg-neutral-950/80 text-white border-t border-white/5">
    <!-- Section glows -->
    <div class="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10 max-w-[1920px]">
      <div class="proj-header mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <span class="proj-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">04 — Selected Works</span>
          <h2 class="proj-title text-4xl md:text-5xl font-black uppercase tracking-tight">Featured Projects</h2>
        </div>
        <p class="proj-desc text-neutral-400 font-light max-w-sm md:text-right">
          A highly curated selection of modern digital experiences.
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-12 md:mb-14 flex justify-center md:justify-start">
        <div class="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-3xl border border-white/10 bg-white/[0.03] p-1.5 md:rounded-full">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="setFilter(cat)"
            class="flex items-center gap-2 rounded-full px-4 md:px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300"
            :class="activeCategory === cat
              ? 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.25)]'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'"
          >
            {{ cat }}
            <span
              class="rounded-full px-1.5 py-0.5 text-[9px] font-mono leading-none"
              :class="activeCategory === cat ? 'bg-black/10 text-black/70' : 'bg-white/10 text-neutral-500'"
            >{{ categoryCounts[cat] }}</span>
          </button>
        </div>
      </div>

      <!-- Projects grid -->
      <div ref="projectsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">

        <a
          v-for="project in filteredProjects"
          :key="project.id"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="proj-card proj-surface group block relative rounded-2xl p-3 cursor-pointer [will-change:transform]"
        >
          <!-- Image -->
          <div class="proj-img-wrap overflow-hidden aspect-[16/9] rounded-xl w-full bg-neutral-900 border border-white/5 relative">
            <div class="w-full h-full">
              <NuxtImg
                :src="project.image"
                :alt="project.title"
                width="800"
                height="450"
                format="webp"
                quality="75"
                loading="lazy"
                class="proj-img w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Details -->
          <div class="flex flex-col gap-4 px-3 pt-5 pb-3">
            <span class="proj-cat w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {{ project.category }}
            </span>

            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h3 class="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight transition-colors group-hover:text-white">
                  {{ project.title }}
                </h3>
                <p class="mt-1 truncate font-mono text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">
                  {{ hostOf(project.link) }}
                </p>
              </div>

              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
              </span>
            </div>
          </div>
        </a>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* Premium card surface: glass + gradient hairline border */
.proj-surface {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.012) 45%,
    rgba(0, 0, 0, 0.25)
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 40px -28px rgba(0, 0, 0, 0.9);
  transition: box-shadow 0.5s ease;
}
.proj-surface::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.24),
    rgba(255, 255, 255, 0.05) 40%,
    rgba(129, 140, 248, 0.26)
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.5;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.proj-surface:hover::before {
  opacity: 1;
}
.proj-surface:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 28px 48px -26px rgba(99, 102, 241, 0.3);
}
</style>
