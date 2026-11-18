<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { skillCategories } from "@/utils/skills";

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const gridRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context;

onMounted(() => {

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
    class="py-32 relative bg-black/90 text-white border-t border-white/5 overflow-hidden"
  >
    <!-- Section glow accents -->
    <div
      class="skills-glow-a absolute top-1/4 left-1/4 w-[600px] h-[300px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"
    ></div>
    <div
      class="skills-glow-b absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10">
      <div class="mb-16 md:mb-20 text-center md:text-left">
        <span
          class="skills-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-4 block"
          >02 — Expertise</span
        >
        <h2
          class="skills-title text-4xl md:text-5xl font-black uppercase tracking-tight"
        >
          Technical Arsenal
        </h2>
        <p class="mt-4 max-w-xl text-neutral-400 font-light mx-auto md:mx-0">
          The tools and technologies I use to design, build and ship fast, modern web products.
        </p>
      </div>

      <div
        ref="gridRef"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
      >
        <div
          v-for="(category, index) in skillCategories"
          :key="category.title"
          class="skill-category flex min-w-0 flex-col rounded-3xl border border-white/5 bg-white/[0.02] p-6 md:p-7 hover:border-white/10 hover:bg-white/[0.04] transition-colors duration-300"
          :class="index === 0 ? 'lg:col-span-2' : ''"
        >
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-sm uppercase tracking-widest text-white font-bold">
              {{ category.title }}
            </h3>
            <span class="font-mono text-xs text-neutral-500">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2.5">
            <div
              v-for="skill in category.skills"
              :key="skill.name"
              class="skill-item group cursor-default"
            >
              <!-- Icon + title live in ONE element, so they always float together -->
              <div class="skill-float inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 pl-2.5 pr-4 py-2 group-hover:bg-white/10 group-hover:border-white/20 transition-colors duration-300">
                <img
                  :src="skill.icon"
                  :alt="skill.name"
                  width="24"
                  height="24"
                  loading="lazy"
                  decoding="async"
                  class="h-6 w-6 shrink-0 object-contain"
                  :class="skill.iconClass"
                />
                <span class="text-xs md:text-sm font-semibold tracking-wide text-neutral-200 group-hover:text-white transition-colors">
                  {{ skill.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Slow ambient drift on the section glows (transform only = GPU cheap) */
.skills-glow-a { animation: skills-drift-a 14s ease-in-out infinite alternate; }
.skills-glow-b { animation: skills-drift-b 18s ease-in-out infinite alternate; }

@keyframes skills-drift-a {
  from { transform: translate3d(-40px, 0, 0) scale(1); }
  to   { transform: translate3d(80px, 40px, 0) scale(1.15); }
}
@keyframes skills-drift-b {
  from { transform: translate3d(40px, 0, 0) scale(1.1); }
  to   { transform: translate3d(-80px, -40px, 0) scale(0.95); }
}

/* Idle float: applied to the whole chip (icon + title together) */
.skill-float {
  will-change: transform;
  animation: skill-bob 5s ease-in-out infinite;
}
.skill-item:nth-child(3n) .skill-float { animation-delay: -1.7s; }
.skill-item:nth-child(3n + 1) .skill-float { animation-delay: -3.4s; }
@keyframes skill-bob {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -4px, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .skills-glow-a, .skills-glow-b, .skill-float { animation: none; }
}
</style>
