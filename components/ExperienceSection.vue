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
    period: "Oct 2024 – May 2026",
    location: "Lahore, Pakistan",
    current: true,
    points: [
      "Boosted app performance by 35% with Vue.js, React.js and Pinia.",
      "Cut development time by 25% through a reusable UI component architecture.",
      "Improved data fetching efficiency by 40% with optimized Axios REST API integrations.",
      "Delivered SaaS platforms and apps (YourMellon, TheMilkApp, WoofTrolly) with 88% client satisfaction.",
      "Trained juniors and interns, reduced production bugs by 20% and ensured 100% cross-browser compatibility.",
    ],
  },
  {
    company: "Scroll X Studio",
    role: "Software Engineer: Frontend Developer",
    period: "May 2023 – Jun 2025",
    location: "Lahore, Pakistan",
    current: false,
    points: [
      "Accelerated code delivery by 35% using AI assistants for rapid prototyping while mentoring interns.",
      "Improved Core Web Vitals by 40% with sub-2s load times (Deadstock, Qamar Medical Center, Grolith).",
      "Built scalable React.js and Vue.js applications, increasing data efficiency by 30% with a 93% satisfaction rate.",
    ],
  },
  {
    company: "F12 Studios",
    role: "Associate Software Engineer",
    period: "Nov 2021 – Mar 2023",
    location: "Lahore, Pakistan",
    current: false,
    points: [
      "Delivered 12+ e-commerce and business platforms for international clients (Mandelli.it, CloudRetailer.com).",
      "Improved site speed by 45% using PageSpeed Insights and GTmetrix.",
      "Increased checkout efficiency by 30% with custom WordPress and WooCommerce solutions.",
      "Boosted organic search visibility by 25% with technical SEO and mobile-first responsiveness.",
    ],
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

  if (!sectionRef.value) {
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
    class="py-32 relative bg-black/80 text-white border-t border-white/5 contain-paint"
  >
    <!-- Section glows -->
    <div
      class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-900/8 rounded-full blur-[120px] pointer-events-none transform-gpu will-change-transform"
    ></div>
    <div
      class="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none transform-gpu"
    ></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10">
      <div class="mb-16 md:mb-20">
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
        class="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 border-t border-white/10 pt-12"
      >
        <!-- Experience timeline -->
        <div class="lg:col-span-7 flex flex-col">
          <h3
            class="col-header text-sm font-bold uppercase tracking-[0.25em] text-neutral-400 mb-10 pb-4 border-b border-white/5"
          >
            Experience
          </h3>

          <div class="relative pl-9 md:pl-12">
            <!-- Vertical line -->
            <div
              class="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-white/40 via-white/15 to-transparent"
            ></div>

            <div
              v-for="job in experiences"
              :key="job.company"
              class="timeline-item group relative mb-8 last:mb-0"
            >
              <!-- Timeline dot -->
              <span
                class="absolute -left-9 md:-left-12 top-7 flex h-4 w-4 items-center justify-center rounded-full border border-white/40 bg-neutral-950"
              >
                <span
                  v-if="job.current"
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60"
                ></span>
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="job.current ? 'bg-green-400' : 'bg-white/60'"
                ></span>
              </span>

              <div
                class="career-card relative overflow-hidden rounded-2xl p-6 md:p-8"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                ></div>

                <div class="relative z-10 flex flex-col gap-3">
                  <div class="flex flex-wrap items-center gap-3">
                    <span
                      class="period-badge text-[11px] uppercase tracking-widest font-bold text-neutral-400 border border-white/10 w-fit px-3 py-1 rounded-full bg-black/50"
                      >{{ job.period }}</span
                    >
                    <span
                      v-if="job.current"
                      class="text-[11px] uppercase tracking-widest font-bold text-green-400"
                      >Current</span
                    >
                  </div>
                  <h4
                    class="item-title text-xl md:text-2xl font-black uppercase tracking-tight text-white mt-1"
                  >
                    {{ job.role }}
                  </h4>
                  <p
                    class="item-subtitle text-base md:text-lg text-neutral-400 italic font-serif"
                  >
                    {{ job.company }}
                    <span class="not-italic font-sans text-xs text-neutral-600 ml-2"
                      >· {{ job.location }}</span
                    >
                  </p>
                  <ul class="item-desc mt-3 flex flex-col gap-2.5">
                    <li
                      v-for="point in job.points"
                      :key="point"
                      class="flex gap-3 text-sm md:text-[15px] text-neutral-400 font-light leading-relaxed"
                    >
                      <span class="mt-2.5 h-px w-3 shrink-0 bg-indigo-300/50"></span>
                      <span>{{ point }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Education + Certificates -->
        <div class="lg:col-span-5 flex flex-col gap-14">
          <div class="flex flex-col">
            <h3
            class="col-header text-sm font-bold uppercase tracking-[0.25em] text-neutral-400 mb-10 pb-4 border-b border-white/5"
          >
            Education
          </h3>

            <div
              v-for="edu in education"
              :key="edu.institution"
              class="timeline-item career-card group relative mb-5 last:mb-0 overflow-hidden rounded-2xl p-6"
            >
              <div class="relative z-10 flex flex-col gap-2">
                <span
                  class="period-badge text-[11px] uppercase tracking-widest font-bold text-neutral-400 border border-white/10 w-fit px-3 py-1 rounded-full bg-black/50"
                  >{{ edu.period }}</span
                >
                <h4
                  class="item-title text-lg font-black uppercase tracking-tight text-white mt-1"
                >
                  {{ edu.degree }}
                </h4>
                <p class="item-subtitle text-base text-neutral-400 italic font-serif">
                  {{ edu.institution }}
                </p>
                <p class="item-desc text-sm text-neutral-500 font-light leading-relaxed">
                  {{ edu.description }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <h3
            class="col-header text-sm font-bold uppercase tracking-[0.25em] text-neutral-400 mb-10 pb-4 border-b border-white/5"
          >
            Certificates
          </h3>

            <div
              v-for="cert in certificates"
              :key="cert.institution"
              class="timeline-item career-card group relative mb-3 last:mb-0 overflow-hidden rounded-xl px-5 py-4"
            >
              <div class="relative z-10 flex items-start justify-between gap-4">
                <div class="flex flex-col gap-1 min-w-0">
                  <h4 class="item-title text-base font-black uppercase tracking-tight text-white">
                    {{ cert.degree }}
                  </h4>
                  <p class="item-subtitle text-sm text-neutral-400 italic font-serif">
                    {{ cert.institution }}
                  </p>
                </div>
                <span
                  class="period-badge shrink-0 text-[11px] uppercase tracking-widest font-bold text-neutral-500 border border-white/10 px-3 py-1 rounded-full bg-black/50"
                  >{{ cert.period }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Premium card: soft glass surface, gradient hairline border, top highlight */
.career-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.055),
    rgba(255, 255, 255, 0.015) 45%,
    rgba(0, 0, 0, 0.25)
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 40px -28px rgba(0, 0, 0, 0.9);
  transition: box-shadow 0.5s ease, background 0.5s ease;
}

/* Gradient hairline border (masked so only the 1px ring shows) */
.career-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.28),
    rgba(255, 255, 255, 0.05) 40%,
    rgba(129, 140, 248, 0.28)
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.55;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

/* Top edge highlight that fades in on hover */
.career-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.career-card:hover::before {
  opacity: 1;
}
.career-card:hover::after {
  opacity: 1;
}
.career-card:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 28px 48px -26px rgba(99, 102, 241, 0.28);
}
</style>
