<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const gridRef = ref<HTMLElement | null>(null);

// Comprehensive skills list using devicon/simpleicons
const skillCategories = [
  {
    title: "Frontend & Frameworks",
    skills: [
      {
        name: "React.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Vue.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
      },
      {
        name: "Nuxt 3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      { name: "Shadcn UI", icon: "https://cdn.simpleicons.org/shadcnui/white" },
      {
        name: "Tailwind CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
    ],
  },
  {
    title: "Backend & Data",
    skills: [
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      { name: "Express.js", icon: "https://cdn.simpleicons.org/express/white" },
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      },
      { name: "Axios", icon: "https://cdn.simpleicons.org/axios/white" },
      {
        name: "Pinia / Redux",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
      },
      { name: "i18n", icon: "https://cdn.simpleicons.org/i18next/white" },
    ],
  },
  {
    title: "CMS & Builders",
    skills: [
      {
        name: "WordPress",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
      },
      {
        name: "Elementor Pro",
        icon: "https://cdn.simpleicons.org/elementor/white",
      },
      { name: "Divi", icon: "https://cdn.simpleicons.org/wordpress/white" }, // Fallback to WP icon for Divi/Bakery
      { name: "WPBakery", icon: "https://cdn.simpleicons.org/wordpress/white" },
      { name: "Shopify", icon: "https://cdn.simpleicons.org/shopify/white" },
      { name: "Webflow", icon: "https://cdn.simpleicons.org/webflow/white" },
    ],
  },
  {
    title: "Design & Tools",
    skills: [
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "Photoshop",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-line.svg",
      },
      {
        name: "Illustrator",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-line.svg",
      },
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
    ],
  },
];

let ctx: gsap.Context;

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return;

  // Small delay to ensure all DOM layout and images are calculated before ScrollTrigger initialization
  setTimeout(() => {
    if (!sectionRef.value) return;

    ctx = gsap.context(() => {
      // Label slide in from left
      gsap.fromTo(
        ".skills-label",
        { x: -40, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.value, start: "top 85%" },
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Title clip-path reveal
      gsap.fromTo(
        ".skills-title",
        { y: 60, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.value, start: "top 83%" },
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          delay: 0.15,
        }
      );

      // Animate each category column in with stagger
      if (gridRef.value) {
        gsap.fromTo(
          ".skill-category",
          { y: 60, opacity: 0 },
          {
            scrollTrigger: { trigger: gridRef.value, start: "top 88%" },
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power4.out",
          }
        );

        // Per-skill-item: scale + fade stagger
        const allCategories = gridRef.value.querySelectorAll(".skill-category");
        allCategories.forEach((cat) => {
          const items = cat.querySelectorAll(".skill-item");
          gsap.fromTo(
            items,
            { scale: 0.85, opacity: 0, y: 20 },
            {
              scrollTrigger: { trigger: cat, start: "top 90%" },
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: "back.out(1.4)",
            }
          );
        });
      }
    }, sectionRef.value);

    ScrollTrigger.refresh();
  }, 100);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <section
    id="skills"
    ref="sectionRef"
    class="py-32 relative bg-neutral-950/80 text-white border-t border-white/5 backdrop-blur-[2px]"
  >
    <!-- Section glow accent -->
    <div
      class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/8 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10">
      <div class="mb-16 md:mb-24 text-center md:text-left">
        <span
          class="skills-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-4 block"
          >02 — Expertise</span
        >
        <h2
          class="skills-title text-4xl md:text-5xl font-black uppercase tracking-tight"
        >
          Technical Arsenal
        </h2>
      </div>

      <div
        ref="gridRef"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
      >
        <div
          v-for="category in skillCategories"
          :key="category.title"
          class="skill-category flex flex-col"
        >
          <h3
            class="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-6 pb-3 border-b border-white/10"
          >
            {{ category.title }}
          </h3>

          <div class="flex flex-col gap-3">
            <div
              v-for="skill in category.skills"
              :key="skill.name"
              class="skill-item group flex items-center gap-4 bg-white/5 border border-white/5 rounded-lg px-4 py-3 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
            >
              <div
                class="w-6 h-6 flex items-center justify-center grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
              >
                <img
                  :src="skill.icon"
                  :alt="skill.name"
                  width="24"
                  height="24"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-contain"
                />
              </div>
              <span
                class="text-sm font-bold tracking-wider text-neutral-300 group-hover:text-white transition-colors"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
