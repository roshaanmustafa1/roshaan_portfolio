<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const colsRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

const experiences = [
  {
    company: "Crossmediasol",
    role: "Frontend Developer",
    period: "2024 – 2026",
    description:
      "Spearheaded the development of complex web applications using Vue.js and Nuxt. Implemented responsive designs and optimized application performance, resulting in a 40% improvement in load times.",
  },
  {
    company: "Softoeaz",
    role: "Frontend Developer Vue.JS",
    period: "2022 – 2024",
    description:
      "Developed and maintained highly customized WordPress themes and plugins. Built custom React components for headless WordPress architectures and mentored junior developers.",
  },
  {
    company: "Capslock Studios",
    role: "Wordpress Developer",
    period: "2020 – 2022",
    description:
      "Collaborated with designers to translate UI/UX wireframes into functional, interactive web pages. Handled cross-browser compatibility issues and ensured accessibility standards were met.",
  },
];

const education = [
  {
    institution: "National College of Business Administration and Economics",
    degree: "Bachelor of Science in Computer Sciences",
    period: "2019 – 2023",
    description:
      "Focus on software engineering, web technologies, and algorithms.",
  },
  {
    institution: "Punjab Colleges",
    degree: "ICS",
    period: "2016 – 2018",
    description: "Graduated with honors.",
  },
];

const certificates = [
  {
    institution: "IT Height",
    degree: "WordPress Developer",
    period: "2017 – 2018",
    description: "Completed professional WordPress development training.",
  },
  {
    institution: "Areena Multimedia",
    degree: "Graphic Designer",
    period: "2018 – 2019",
    description: "Completed graphic design and multimedia training.",
  },
  {
    institution: "Dr Coders",
    degree: "MERN Stack Developer",
    period: "2022 – 2023",
    description: "Completed MERN stack development training.",
  },
];

onMounted(async () => {
  await nextTick();

  const shouldReduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce), (max-width: 767px)",
  ).matches;

  if (shouldReduceMotion || !sectionRef.value) {
    ScrollTrigger.refresh();
    return;
  }

  ctx = gsap.context(() => {
    gsap.from(".exp-label", {
      scrollTrigger: { trigger: sectionRef.value, start: "top 80%" },
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(".exp-title", {
      scrollTrigger: { trigger: sectionRef.value, start: "top 78%" },
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
      delay: 0.15,
    });

    gsap.from(".col-header", {
      scrollTrigger: { trigger: colsRef.value, start: "top 82%" },
      y: -30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out",
    });

    if (colsRef.value) {
      const items = gsap.utils.toArray<HTMLElement>(
        ".timeline-item",
        colsRef.value,
      );

      items.forEach((item) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            once: true,
          },
        });

        const badge = item.querySelector(".period-badge");
        const title = item.querySelector(".item-title");
        const subtitle = item.querySelector(".item-subtitle");
        const desc = item.querySelector(".item-desc");

        tl.from(item, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });

        if (badge)
          tl.from(badge, { scale: 0.9, opacity: 0, duration: 0.3 }, "-=0.3");
        if (title)
          tl.from(title, { x: -12, opacity: 0, duration: 0.35 }, "-=0.2");
        if (subtitle)
          tl.from(subtitle, { opacity: 0, duration: 0.3 }, "-=0.15");
        if (desc)
          tl.from(desc, { y: 10, opacity: 0, duration: 0.35 }, "-=0.25");
      });
    }

    ScrollTrigger.refresh();
  }, sectionRef.value);
});

onUnmounted(() => {
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<template>
  <section
    id="experience"
    ref="sectionRef"
    class="py-32 relative bg-black/80 text-white border-t border-white/5 backdrop-blur-[2px] contain-paint"
  >
    <!-- Section glow (GPU accelerated) -->
    <div
      class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-900/8 rounded-full blur-[120px] pointer-events-none transform-gpu will-change-transform"
    ></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10">
      <div class="mb-20 md:mb-24">
        <span
          class="exp-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-4 block"
          >03 — Resume</span
        >
        <h2
          class="exp-title text-4xl md:text-6xl font-black uppercase tracking-tighter"
        >
          Career & Education
        </h2>
      </div>

      <div
        ref="colsRef"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 border-t border-white/10 pt-12"
      >
        <!-- Experience Column -->
        <div class="flex flex-col">
          <h3
            class="col-header text-2xl font-bold uppercase tracking-widest text-neutral-400 mb-10 pb-4 border-b border-white/5"
          >
            Experience
          </h3>

          <div
            v-for="job in experiences"
            :key="job.company"
            class="timeline-item group relative p-8 mb-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 overflow-hidden will-change-transform"
          >
            <!-- Premium subtle glow hover effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            ></div>

            <div class="relative z-10 flex flex-col gap-3">
              <span
                class="period-badge text-xs uppercase tracking-widest font-bold text-neutral-500 border border-white/10 w-fit px-3 py-1 rounded-full bg-black/50"
                >{{ job.period }}</span
              >
              <h4
                class="item-title text-2xl font-black uppercase tracking-tight text-white mt-2 group-hover:text-white/80 transition-colors"
              >
                {{ job.role }}
              </h4>
              <p
                class="item-subtitle text-lg text-neutral-400 italic font-serif"
              >
                {{ job.company }}
              </p>
              <p
                class="item-desc text-md text-neutral-500 font-light mt-2 leading-relaxed"
              >
                {{ job.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Education Column -->
        <div class="flex flex-col">
          <h3
            class="col-header text-2xl font-bold uppercase tracking-widest text-neutral-400 mb-10 pb-4 border-b border-white/5"
          >
            Education
          </h3>

          <div
            v-for="edu in education"
            :key="edu.institution"
            class="timeline-item group relative p-8 mb-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 overflow-hidden will-change-transform"
          >
            <!-- Premium subtle glow hover effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            ></div>

            <div class="relative z-10 flex flex-col gap-3">
              <span
                class="period-badge text-xs uppercase tracking-widest font-bold text-neutral-500 border border-white/10 w-fit px-3 py-1 rounded-full bg-black/50"
                >{{ edu.period }}</span
              >
              <h4
                class="item-title text-2xl font-black uppercase tracking-tight text-white mt-2 group-hover:text-white/80 transition-colors"
              >
                {{ edu.degree }}
              </h4>
              <p
                class="item-subtitle text-lg text-neutral-400 italic font-serif"
              >
                {{ edu.institution }}
              </p>
              <p
                class="item-desc text-md text-neutral-500 font-light mt-2 leading-relaxed"
              >
                {{ edu.description }}
              </p>
            </div>
          </div>
        </div>
        <!-- Certificates Column -->
        <div class="flex flex-col">
          <h3
            class="col-header text-2xl font-bold uppercase tracking-widest text-neutral-400 mb-10 pb-4 border-b border-white/5"
          >
            Certificates
          </h3>

          <div
            v-for="cert in certificates"
            :key="cert.institution"
            class="timeline-item group relative p-8 mb-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            ></div>

            <div class="relative z-10 flex flex-col gap-3">
              <span
                class="period-badge text-xs uppercase tracking-widest font-bold text-neutral-500 border border-white/10 w-fit px-3 py-1 rounded-full bg-black/50"
                >{{ cert.period }}</span
              >
              <h4
                class="item-title text-2xl font-black uppercase tracking-tight text-white mt-2 group-hover:text-white/80 transition-colors"
              >
                {{ cert.degree }}
              </h4>
              <p
                class="item-subtitle text-lg text-neutral-400 italic font-serif"
              >
                {{ cert.institution }}
              </p>
              <p
                class="item-desc text-md text-neutral-500 font-light mt-2 leading-relaxed"
              >
                {{ cert.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
