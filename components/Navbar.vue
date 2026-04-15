<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import LogoIcon from '@/components/icons/LogoIcon.vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
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

const animateMenuOpen = () => {
  const tl = gsap.timeline()
  tl.to('.mobile-menu-overlay', {
    clipPath: 'circle(150% at 100% 0%)',
    duration: 0.8,
    ease: 'power4.inOut'
  })
  tl.from('.mobile-nav-link', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.3')
}

const animateMenuClose = () => {
  gsap.to('.mobile-menu-overlay', {
    clipPath: 'circle(0% at 100% 0%)',
    duration: 0.6,
    ease: 'power4.inOut'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
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
      'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
      isScrolled 
        ? 'bg-neutral-950/80 backdrop-blur-md border-b border-white/5 py-4' 
        : 'bg-transparent py-8'
    ]"
  >
    <div class="container mx-auto px-6 md:px-12 flex items-center justify-between">
      
      <NuxtLink to="/" class="nav-item font-black text-2xl tracking-tighter text-white hover:opacity-70 transition-opacity flex items-center gap-1">
        <img src="/public/Roshaan_Logo_white.svg" class="w-10 text-white fill-white" alt="">
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
          class="relative z-[110] flex flex-col justify-between w-6 h-3.5 group"
        >
          <span :class="['w-full h-[1.5px] bg-white transition-all duration-300 transform origin-left', isMobileMenuOpen ? 'rotate-[42deg] translate-x-[2px]' : '']"></span>
          <span :class="['w-full h-[1.5px] bg-white transition-all duration-300', isMobileMenuOpen ? 'opacity-0 scale-x-0' : '']"></span>
          <span :class="['w-full h-[1.5px] bg-white transition-all duration-300 transform origin-left', isMobileMenuOpen ? '-rotate-[42deg] translate-x-[2px]' : '']"></span>
        </button>
      </div>

    </div>

    <!-- Mobile menu overlay -->
    <div 
      class="mobile-menu-overlay fixed inset-0 bg-neutral-950 z-[105] flex flex-col items-center justify-center pointer-events-none"
      style="clip-path: circle(0% at 100% 0%);"
      :class="{ 'pointer-events-auto': isMobileMenuOpen }"
    >
      <nav class="flex flex-col items-center gap-8">
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
  </header>
</template>
