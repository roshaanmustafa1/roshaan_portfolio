<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Download, Mail, Phone } from "lucide-vue-next";
import gsap from "gsap";
import { skills } from "@/utils/skills";

const sectionRef = ref<HTMLElement | null>(null);
const magneticWrappers = ref<HTMLElement[]>([]);
const heroSkillNames = [
  "React.js",
  "Vue.js",
  "Nuxt 3",
  "Next.js",
  "Tailwind CSS",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "WordPress",
  "Figma",
  "Git",
  "ChatGPT",
];
const skillLogosByName = new Map(skills.map((skill) => [skill.name, skill]));
const skillLogos = heroSkillNames.flatMap((name) => {
  const skill = skillLogosByName.get(name);
  return skill ? [skill] : [];
});

// Safe Ref Collector (Prevents duplicate entries on mobile re-renders)
const setMagneticRef = (el: any) => {
  if (el && !magneticWrappers.value.includes(el)) {
    magneticWrappers.value.push(el as HTMLElement);
  }
};

// Typewriter
const roles = [
  "AI Powered Frontend Developer",
  "React & Vue Js Developer",
  "WordPress Expert",
  "Photoshop & Illustrator Designer",
];
const currentRole = ref("AI Powered Frontend Developer");
const isDeleting = ref(false);
const loopNum = ref(0);
const typingSpeed = ref(150);

let typingInterval: ReturnType<typeof setTimeout> | null = null;
let ctx: gsap.Context | null = null;
let prefersReducedMotion = false;

// Mobile viewport check removed to allow animations on all devices
const clearTypingTimer = () => {
  if (typingInterval) {
    clearTimeout(typingInterval);
    typingInterval = null;
  }
};

const type = () => {
  if (prefersReducedMotion) {
    currentRole.value = roles[0];
    return;
  }

  const i = loopNum.value % roles.length;
  const fullText = roles[i];

  if (isDeleting.value) {
    currentRole.value = fullText.substring(0, currentRole.value.length - 1);
    typingSpeed.value = 40;
  } else {
    currentRole.value = fullText.substring(0, currentRole.value.length + 1);
    typingSpeed.value = 100;
  }

  if (!isDeleting.value && currentRole.value === fullText) {
    typingSpeed.value = 1800;
    isDeleting.value = true;
  } else if (isDeleting.value && currentRole.value === "") {
    isDeleting.value = false;
    loopNum.value++;
    typingSpeed.value = 300;
  }

  clearTypingTimer();
  typingInterval = setTimeout(type, typingSpeed.value);
};

const handleMagneticMove = (e: MouseEvent, element: HTMLElement) => {
  if (window.innerWidth < 768 || prefersReducedMotion) return;

  const child = element.children[0] as HTMLElement | undefined;
  if (!child) return;

  const rect = element.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  gsap.to(child, {
    x: x * 0.35,
    y: y * 0.35,
    duration: 0.6,
    ease: "power3.out",
    overwrite: true,
  });
};

const handleMagneticLeave = (element: HTMLElement) => {
  if (window.innerWidth < 768 || prefersReducedMotion) return;

  const child = element.children[0] as HTMLElement | undefined;
  if (!child) return;

  gsap.to(child, {
    x: 0,
    y: 0,
    duration: 0.8,
    ease: "elastic.out(1, 0.3)",
    overwrite: true,
  });
};

onMounted(() => {
  prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  type();

  if (!sectionRef.value) return;

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      delay: 0.3,
    });

    tl.fromTo(
      ".hero-badge",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8 },
    )
      .fromTo(
        ".hero-label",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3",
      )
      .fromTo(
        ".hero-line-1",
        { y: 130, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3 },
        "-=0.5",
      )
      .fromTo(
        ".hero-line-2",
        { y: 130, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3 },
        "-=1.1",
      )
      .fromTo(
        ".hero-meta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
        "-=0.6",
      )
      .fromTo(
        ".hero-skill-slider",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.45",
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.7, stagger: 0.1 },
        "-=0.5",
      );

    magneticWrappers.value.forEach((wrapper) => {
      wrapper.addEventListener(
        "mousemove",
        (e) => handleMagneticMove(e, wrapper),
        { passive: true },
      );
      wrapper.addEventListener("mouseleave", () =>
        handleMagneticLeave(wrapper),
      );
    });
  }, sectionRef.value);
});

onUnmounted(() => {
  clearTypingTimer();
  ctx?.revert();
  ctx = null;
  magneticWrappers.value = [];
});
</script>

<template>
  <section
    ref="sectionRef"
    id="home"
    class="relative min-h-screen flex flex-col bg-transparent text-white overflow-hidden select-none"
  >
    <div
      class="absolute inset-0 z-0 bg-radial-vignette pointer-events-none"
    ></div>

    <div
      class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none z-0"
    ></div>
    <div
      class="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-900/10 blur-[100px] pointer-events-none z-0"
    ></div>

    <div
      class="relative z-10 container mx-auto px-6 md:px-12 flex flex-col min-h-screen"
    >
      <div
        class="hero-badge flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-32 pb-10 border-b border-white/10"
      >
        <div class="flex items-center gap-3">
          <span class="relative flex h-2.5 w-2.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="inline-flex rounded-full h-2.5 w-2.5 bg-green-500"
            ></span>
          </span>
          <span
            class="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400"
            >Open to Work · Lahore, PK</span
          >
        </div>
        <div
          class="flex flex-wrap lg:gap-6 gap-4 md:mt-0 mt-4 text-xs font-mono tracking-widest text-neutral-600"
        >
          <a
            href="tel:+923134781894"
            class="inline-flex items-center gap-2 hover:text-neutral-300 transition-colors"
          >
            <Phone class="h-3.5 w-3.5" />
            +92 313 4781894
          </a>
          <span>·</span>
          <a
            href="mailto:roshaanmustafa1@gmail.com"
            class="inline-flex items-center gap-2 hover:text-neutral-300 transition-colors"
          >
            <Mail class="h-3.5 w-3.5" />
            roshaanmustafa1@gmail.com
          </a>
        </div>
      </div>

      <div class="flex-grow flex flex-col justify-center py-10 md:py-18">
        <div class="hero-label mb-8 flex items-center gap-3">
          <div class="h-[1px] w-12 bg-neutral-600"></div>
          <span
            class="text-xs md:text-lg font-mono tracking-[0.3em] uppercase text-neutral-500"
            >Roshaan Mustafa</span
          >
        </div>

        <div class="flex flex-col gap-0 overflow-hidden">
          <div class="overflow-hidden py-2">
            <h1
              class="hero-line-1 font-black uppercase tracking-[-0.03em] leading-[1.1] text-white"
              style="font-size: clamp(2.5rem, 12vw, 5.5rem)"
            >
              Building AI-Powered<br>Web Applications
            </h1>
          </div>
          <div class="overflow-hidden py-2">
            <h1
              class="hero-line-2 font-black uppercase tracking-[-0.03em] leading-[0.87]"
              style="
                color: transparent;
                -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.25);
                font-size: clamp(2.5rem, 12vw, 5.5rem);
              "
            >
              & Wordpress Expert
            </h1>
          </div>
        </div>

        <div class="hero-meta w-full h-[1px] bg-white/10 my-10"></div>

        <div
          class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10"
        >
          <div class="flex flex-col gap-4 max-w-lg">
            <div
              class="hero-meta flex items-center gap-3 font-mono text-sm md:text-base text-neutral-300 min-h-[24px]"
            >
              <span class="text-neutral-600 text-xs flex-shrink-0">[</span>

              <span class="inline-block min-w-[18ch] whitespace-nowrap">
                {{ currentRole || "AI Powered Frontend Developer" }}
              </span>

              <span
                class="inline-flex w-[2px] h-4 bg-white animate-pulse ml-0.5 flex-shrink-0"
              ></span>
              <span class="text-neutral-600 text-xs flex-shrink-0">]</span>
            </div>
            <p
              class="hero-meta text-neutral-500 text-sm md:text-base font-light leading-relaxed"
            >
              Passionate about building
              <span class="text-neutral-300">AI-powered applications</span>,
              <span class="text-neutral-300">intelligent workflows</span>, and
              <span class="text-neutral-300">modern digital products</span> that
              combine software engineering, automation, and exceptional user
              experiences using 
              <span class="text-neutral-300">React, Vue, WordPress, and emerging AI
              technologies.</span>
            </p>
          </div>

          <div
            class="flex w-full flex-shrink-0 flex-col items-start gap-5 lg:w-auto lg:items-end"
          >
            <div class="hero-skill-slider w-full max-w-full lg:w-[600px]">
              <div
                class="hero-logo-mask relative overflow-hidden border-y border-white/10 py-3"
              >
                <div class="hero-logo-track flex flex-nowrap w-max items-center">
                  <div class="flex shrink-0 items-center gap-3 pr-3 flex-nowrap">
                    <div
                      v-for="skill in skillLogos"
                      :key="`hero-logo-${skill.name}`"
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 backdrop-blur-sm"
                    >
                      <img
                        :src="skill.icon"
                        :alt="skill.name"
                        width="28"
                        height="28"
                        loading="lazy"
                        decoding="async"
                        class="h-7 w-7 object-contain grayscale opacity-80 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                        :class="skill.iconClass"
                      />
                    </div>
                  </div>

                  <div
                    class="flex shrink-0 items-center gap-3 pr-3 flex-nowrap"
                    aria-hidden="true"
                  >
                    <div
                      v-for="skill in skillLogos"
                      :key="`hero-logo-clone-${skill.name}`"
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 backdrop-blur-sm"
                    >
                      <img
                        :src="skill.icon"
                        alt=""
                        width="28"
                        height="28"
                        loading="lazy"
                        decoding="async"
                        class="h-7 w-7 object-contain grayscale opacity-80 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                        :class="skill.iconClass"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 sm:gap-5">
              <div
                class="relative inline-block p-5 -m-5 cursor-pointer"
                :ref="setMagneticRef"
              >
                <a
                  href="#projects"
                  class="hero-cta inline-flex items-center gap-3 px-4 py-3 md:py-4 md:px-8 bg-white text-black rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-neutral-100 transition-colors group"
                >
                  View Work
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="group-hover:translate-x-1 transition-transform"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
              <div
                class="relative inline-block p-5 -m-5 cursor-pointer"
                :ref="setMagneticRef"
              >
                <a
                  href="/roshaan-frontend-dev-ai.pdf"
                  download="roshaan-frontend-dev-ai.pdf"
                  class="hero-cta inline-flex items-center gap-3 px-4 py-3 md:py-4 md:px-8 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-white/5 transition-colors group"
                >
                  Download Resume
                  <Download
                    class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
                    :stroke-width="2.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-meta flex justify-center pb-10">
        <div
          class="flex flex-col items-center gap-2 text-neutral-700 opacity-60"
        >
          <span class="text-[9px] uppercase tracking-[0.3em] font-mono"
            >Scroll</span
          >
          <div class="w-[1px] h-10 bg-neutral-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-logo-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: hero-logo-marquee 25s linear infinite;
}

.hero-logo-mask {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 14%,
    black 86%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    black 14%,
    black 86%,
    transparent
  );
}

@media (hover: hover) and (pointer: fine) {
  .hero-skill-slider:hover .hero-logo-track {
    animation-play-state: paused;
  }
}

/* Fixed Hardware Acceleration for Mobile & Safari browsers */
@keyframes hero-logo-marquee {
  0% {
    transform: translateZ(0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

/* Mobile smooth animation speed adjustment */
@media (max-width: 767px) {
  .hero-logo-track {
    animation: hero-logo-marquee 16s linear infinite;
  }
}


@media (prefers-reduced-motion: reduce) {
  .hero-logo-track {
    animation: none !important;
  }
}
</style>
