<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)

let lastScrollTime = 0

const handleScroll = () => {
  const now = Date.now()
  if (now - lastScrollTime > 100) {
    isScrolled.value = window.scrollY > 50
    lastScrollTime = now
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
    nextTick(() => animateMenuOpen())
  } else {
    document.body.style.overflow = ''
    animateMenuClose()
  }
}

const closeMobileMenu = () => {
  if (isMobileMenuOpen.value) toggleMobileMenu()
}

let menuAnimation: any = null

const animateMenuOpen = () => {
  if (menuAnimation) menuAnimation.kill()
  menuAnimation = gsap.timeline()
  
  menuAnimation.to('.mobile-menu-overlay', {
    clipPath: 'circle(150% at 100% 0%)',
    duration: 0.8,
    ease: 'power4.inOut'
  })
  menuAnimation.fromTo('.mobile-nav-link', 
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    }, 
    '-=0.3'
  )
}

const animateMenuClose = () => {
  if (menuAnimation) menuAnimation.kill()
  menuAnimation = gsap.timeline()
  
  menuAnimation.to('.mobile-menu-overlay', {
    clipPath: 'circle(0% at 100% 0%)',
    duration: 0.6,
    ease: 'power4.inOut'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  
  // Entrance animation for header elements
  gsap.from('.nav-item', {
    y: -20,
    
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 1.2
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
]
</script>

<template>
  <header
    ref="navRef"
    :class="[
      'fixed top-0 left-0 right-0 transition-all duration-500',
      isMobileMenuOpen ? 'z-[110]' : 'z-[100]',
      isScrolled 
        ? 'bg-neutral-950/80 backdrop-blur-md border-b border-white/5 py-4' 
        : 'bg-transparent py-8'
    ]"
  >
    <div class="container mx-auto px-6 md:px-12 flex items-center justify-between">
      
      <NuxtLink to="/" class="nav-item font-black text-2xl tracking-tighter text-white hover:opacity-70 transition-opacity flex items-center gap-1">
        <NuxtImg
          src="/Roshaan_Logo_white.svg"
          alt="Roshaan Mustafa"
          width="40"
          height="40"
          loading="eager"
          class="w-10 text-white fill-white"
        />
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-10">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          :href="link.href"
          class="nav-item text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 hover:text-white transition-colors relative group"
        >
          {{ link.name }}
          <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </a>
        
        <a href="#contact" class="nav-item px-6 py-2 bg-white text-black text-[10px] uppercase font-bold tracking-[0.15em] rounded-full hover:bg-neutral-200 transition-colors">
          Hire Me
        </a>
      </nav>

      <!-- Mobile menu button -->
      <div class="md:hidden nav-item">
        <button 
          @click="toggleMobileMenu"
          :aria-label="isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'"
          class="relative z-[120] flex h-10 w-10 items-center justify-center"
        >
          <span
            :class="[
              'absolute h-[1.5px] w-6 bg-white transition-all duration-300',
              isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-[6px]'
            ]"
          ></span>
          <span
            :class="[
              'absolute h-[1.5px] w-6 bg-white transition-all duration-300',
              isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            ]"
          ></span>
          <span
            :class="[
              'absolute h-[1.5px] w-6 bg-white transition-all duration-300',
              isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-[6px]'
            ]"
          ></span>
        </button>
      </div>

    </div>
  </header>

  <!-- Mobile menu overlay -->
  <div 
    class="mobile-menu-overlay fixed inset-0 bg-neutral-950 z-[105] flex flex-col items-center justify-center pointer-events-none"
    style="clip-path: circle(0% at 100% 0%);"
    :class="{ 'pointer-events-auto': isMobileMenuOpen }"
    @click="closeMobileMenu"
  >
    <nav class="flex flex-col items-center gap-8" @click.stop>
      <a 
        v-for="link in navLinks" 
        :key="link.name" 
        :href="link.href"
        @click="closeMobileMenu"
        class="mobile-nav-link text-4xl font-black uppercase tracking-tighter text-white hover:text-neutral-500 transition-colors"
      >
        {{ link.name }}
      </a>
      <a 
        href="#contact" 
        @click="closeMobileMenu"
        class="mobile-nav-link mt-8 px-10 py-4 border border-white/20 rounded-full text-sm uppercase tracking-widest font-bold"
      >
        Let's Talk
      </a>
    </nav>
    
    <!-- Decorative background text in mobile menu -->
    <div class="absolute bottom-20 left-1/2 -translate-x-1/2 text-[20vw] font-black text-white/[0.02] leading-none select-none pointer-events-none whitespace-nowrap uppercase">
      Navigation
    </div>
  </div>
</template>
