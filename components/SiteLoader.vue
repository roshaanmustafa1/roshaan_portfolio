<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>

<template>
  <div
    class="loader-shell fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-neutral-950 text-foreground"
    role="status"
    aria-live="polite"
    aria-label="Website loading"
  >
    <div class="absolute inset-0 z-0 bg-radial-vignette pointer-events-none"></div>
    <div
      class="absolute -top-40 -left-40 z-0 h-[600px] w-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-40 -right-40 z-0 h-[500px] w-[500px] rounded-full bg-violet-900/10 blur-[100px] pointer-events-none"
    ></div>

    <div class="relative z-10 flex items-center justify-center">
      <div class="loader-mark h-16 w-24 sm:h-20 sm:w-32" aria-hidden="true">
        <span class="loader-piece loader-piece-left"></span>
        <span class="loader-piece loader-piece-center"></span>
        <span class="loader-piece loader-piece-right"></span>
        <span class="loader-piece loader-piece-accent"></span>
      </div>
    </div>

    <div class="absolute inset-x-6 bottom-[30px] z-10 flex flex-col items-center gap-4">
      <span class="min-w-20 text-center text-xl font-semibold tabular-nums tracking-[0.18em] text-foreground md:text-2xl">
        {{ progress }}%
      </span>

      <div
        class="loader-progress-track"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span class="loader-progress-fill" :style="{ width: `${progress}%` }"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader-mark {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transform: translateZ(0);
}

.loader-piece {
  --logo-mask: url("/Roshaan_Logo_white.svg");
  position: absolute;
  inset: 0;
  background: #ffffff;
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.15));
  -webkit-mask: var(--logo-mask) center / contain no-repeat;
  mask: var(--logo-mask) center / contain no-repeat;
  will-change: transform, clip-path;
}

.loader-piece-left {
  clip-path: polygon(0 0, 45% 0, 31% 100%, 0 100%);
  animation: loader-build-left 3.8s cubic-bezier(0.76, 0, 0.24, 1) infinite;
}

.loader-piece-center {
  clip-path: polygon(31% 0, 72% 0, 58% 100%, 18% 100%);
  animation: loader-build-center 3.8s cubic-bezier(0.76, 0, 0.24, 1) infinite;
}

.loader-piece-right {
  clip-path: polygon(64% 0, 100% 0, 100% 100%, 50% 100%);
  animation: loader-build-right 3.8s cubic-bezier(0.76, 0, 0.24, 1) infinite;
}

.loader-piece-accent {
  background: linear-gradient(135deg, hsl(var(--loader-foreground)), hsl(var(--loader-accent-foreground)));
  clip-path: polygon(52% 0, 82% 0, 68% 100%, 40% 100%);
  animation: loader-build-accent 3.8s cubic-bezier(0.76, 0, 0.24, 1) infinite;
}

.loader-progress-track {
  position: relative;
  width: min(320px, calc(100vw - 48px));
  height: 3px;
  overflow: hidden;
  border-radius: 999px;
  background: hsl(var(--primary) / 0.12);
}

.loader-progress-track::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px hsl(var(--primary) / 0.08);
  pointer-events: none;
}

.loader-progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--loader-muted)));
  box-shadow: 0 0 18px hsl(var(--loader-muted) / 0.24);
  transition: width 220ms cubic-bezier(0.76, 0, 0.24, 1);
  will-change: width;
}

@keyframes loader-build-left {
  0%,
  7% {
    transform: translate3d(-108%, 0, 0) skewX(-14deg);
  }
  22%,
  64% {
    transform: translate3d(0, 0, 0) skewX(0);
  }
  82%,
  100% {
    transform: translate3d(108%, 0, 0) skewX(12deg);
  }
}

@keyframes loader-build-center {
  0%,
  13% {
    transform: translate3d(0, 112%, 0) skewY(12deg);
  }
  28%,
  68% {
    transform: translate3d(0, 0, 0) skewY(0);
  }
  86%,
  100% {
    transform: translate3d(0, -112%, 0) skewY(-10deg);
  }
}

@keyframes loader-build-right {
  0%,
  19% {
    transform: translate3d(108%, 0, 0) skewX(14deg);
  }
  34%,
  72% {
    transform: translate3d(0, 0, 0) skewX(0);
  }
  90%,
  100% {
    transform: translate3d(-108%, 0, 0) skewX(-12deg);
  }
}

@keyframes loader-build-accent {
  0%,
  34% {
    transform: translate3d(-118%, 0, 0) skewX(-18deg);
  }
  48%,
  70% {
    transform: translate3d(0, 0, 0) skewX(0);
  }
  88%,
  100% {
    transform: translate3d(118%, 0, 0) skewX(16deg);
  }
}



@media (prefers-reduced-motion: reduce) {
  .loader-mark::after,
  .loader-piece {
    animation: none;
    transform: none;
  }
}
</style>
