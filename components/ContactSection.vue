<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Mail, Phone, MapPin, Linkedin, Send, ArrowUpRight, Check, Clock } from 'lucide-vue-next'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

const EMAIL = 'roshaanmustafa1@gmail.com'

const contactItems = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, icon: Mail },
  { label: 'Phone', value: '+92 313 4781894', href: 'tel:+923134781894', icon: Phone },
  { label: 'Location', value: 'Lahore, Pakistan', href: null, icon: MapPin },
  {
    label: 'LinkedIn',
    value: 'Roshaan Moeez Mustafa',
    href: 'https://linkedin.com/in/roshaan-moeez-mustafa-547611231',
    icon: Linkedin,
  },
]

const form = ref({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const subject = encodeURIComponent(`Portfolio message from ${form.value.name}`)
    const body = encodeURIComponent(`${form.value.message}\n\n— ${form.value.name} (${form.value.email})`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`

    form.value = { name: '', email: '', message: '' }
    isSuccess.value = true
  } catch (err) {
    errorMessage.value =
      err instanceof Error && err.message
        ? err.message
        : 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await nextTick()
  if (!sectionRef.value) return

  ctx = gsap.context(() => {
    // Label slide
    gsap.from('.contact-label', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
      x: -40, opacity: 0, duration: 0.8, ease: 'power3.out'
    })

    // Title reveal
    gsap.from('.contact-title', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 75%' },
      y: 80, opacity: 0, duration: 1.2,
      ease: 'power4.out', delay: 0.1
    })

    // Subtext + contact cards stagger
    gsap.from('.contact-reveal', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 72%' },
      y: 30, opacity: 0, duration: 1, stagger: 0.12,
      ease: 'power3.out', delay: 0.3
    })

    // Form container slide
    gsap.from('.contact-form-card', {
      scrollTrigger: { trigger: '.contact-form-card', start: 'top 85%' },
      x: 60, opacity: 0, duration: 1.2,
      ease: 'power4.out'
    })

    // Form inputs stagger
    gsap.from('.contact-input-wrap', {
      scrollTrigger: { trigger: '.contact-form-card', start: 'top 80%' },
      y: 30, opacity: 0, duration: 0.8, stagger: 0.12,
      ease: 'power3.out', delay: 0.4
    })
  }, sectionRef.value)

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  ctx?.revert()
  ctx = null
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="pt-32 pb-40 relative bg-black/80 text-white overflow-hidden border-t border-white/5">
    <!-- Section glows -->
    <div class="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[450px] h-[350px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10">

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">

        <!-- Left: intro + contact details -->
        <div class="lg:col-span-5 flex flex-col">
          <span class="contact-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-6 block">05 — Connect</span>

          <h2 class="contact-title text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            Let's<br />Talk<span class="text-neutral-500">.</span>
          </h2>

          <span class="contact-reveal mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-300">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Available for new projects
          </span>

          <p class="contact-reveal text-base md:text-lg font-light text-neutral-400 max-w-md mb-10 leading-relaxed">
            Have a project in mind or looking for a frontend developer? Send me a message and let's build something exceptional together.
          </p>

          <div class="flex flex-col gap-3">
            <template v-for="item in contactItems" :key="item.label">
              <component
                :is="item.href ? 'a' : 'div'"
                :href="item.href || undefined"
                :target="item.href && item.href.startsWith('http') ? '_blank' : undefined"
                :rel="item.href && item.href.startsWith('http') ? 'noopener noreferrer' : undefined"
                class="contact-reveal contact-card group flex items-center gap-4 rounded-2xl px-5 py-4"
              >
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-300 group-hover:text-white group-hover:border-white/25 transition-colors duration-300">
                  <component :is="item.icon" class="h-[18px] w-[18px]" :stroke-width="1.75" />
                </span>
                <span class="flex min-w-0 flex-col">
                  <span class="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-bold">{{ item.label }}</span>
                  <span class="truncate text-base md:text-lg font-light text-neutral-200 group-hover:text-white transition-colors">{{ item.value }}</span>
                </span>
                <ArrowUpRight
                  v-if="item.href"
                  class="ml-auto h-4 w-4 shrink-0 text-neutral-600 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-white"
                  :stroke-width="2"
                />
              </component>
            </template>
          </div>
        </div>

        <!-- Right: form -->
        <div class="lg:col-span-7 contact-form-card contact-card rounded-3xl p-7 md:p-12">
          <div class="mb-10">
            <h3 class="text-2xl md:text-3xl font-black uppercase tracking-tight">Send a message</h3>
            <p class="mt-2 text-sm text-neutral-500 font-light">Tell me a little about your project and I'll get back to you soon.</p>
          </div>

          <div v-if="isSuccess" class="flex flex-col items-center justify-center text-center py-14">
            <span class="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
              <Check class="h-8 w-8" :stroke-width="2" />
            </span>
            <h3 class="text-3xl font-bold text-white mb-3">Almost there!</h3>
            <p class="text-neutral-300">Your email app should have opened with your message ready to send.</p>
            <p class="text-sm text-neutral-500 mt-2">
              Nothing opened? Email me directly at
              <a :href="`mailto:${EMAIL}`" class="text-neutral-300 underline underline-offset-4 hover:text-white">{{ EMAIL }}</a>
            </p>
            <button
              type="button"
              class="mt-8 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
              @click="isSuccess = false"
            >
              Write another message
            </button>
          </div>

          <form v-else @submit.prevent="submitForm" class="flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="contact-input-wrap flex flex-col gap-2.5">
                <label for="contact-name" class="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Your Name</label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  placeholder="John Doe"
                  class="contact-field"
                  required
                />
              </div>

              <div class="contact-input-wrap flex flex-col gap-2.5">
                <label for="contact-email" class="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Your Email</label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  placeholder="john@company.com"
                  class="contact-field"
                  required
                />
              </div>
            </div>

            <div class="contact-input-wrap flex flex-col gap-2.5">
              <label for="contact-message" class="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Project Details</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                placeholder="Tell me about your vision..."
                rows="5"
                class="contact-field resize-none"
                required
              ></textarea>
            </div>

            <div class="contact-input-wrap mt-4 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 border-t border-white/10 pt-8">
              <div class="flex items-start gap-3">
                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-400">
                  <Clock class="h-4 w-4" :stroke-width="1.75" />
                </span>
                <div class="flex flex-col">
                  <span class="text-sm text-neutral-300">Usually replies within 24 hours</span>
                  <span class="text-xs text-neutral-600 font-light">Opens your email app with the message ready to send.</span>
                </div>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-9 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                <Send v-if="!isSubmitting" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" :stroke-width="2.25" />
              </button>
            </div>

            <div v-if="errorMessage" class="p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {{ errorMessage }}
            </div>
          </form>
        </div>

      </div>

    </div>

    <!-- Soft fade into the footer -->
    <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>
  </section>
</template>

<style scoped>
/* Premium glass surface with gradient hairline border (same language as Career cards) */
.contact-card {
  position: relative;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.055),
    rgba(255, 255, 255, 0.015) 45%,
    rgba(0, 0, 0, 0.25)
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 40px -28px rgba(0, 0, 0, 0.9);
  transition: box-shadow 0.5s ease;
}
.contact-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.26),
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
a.contact-card:hover::before {
  opacity: 1;
}
a.contact-card:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 24px 44px -26px rgba(99, 102, 241, 0.28);
}

/* Form fields */
.contact-field {
  width: 100%;
  border-radius: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.95rem 1.1rem;
  font-size: 1rem;
  font-weight: 300;
  color: #fff;
  outline: none;
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}
.contact-field::placeholder {
  color: rgb(82 82 91);
}
.contact-field:focus {
  border-color: rgba(129, 140, 248, 0.55);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
</style>
