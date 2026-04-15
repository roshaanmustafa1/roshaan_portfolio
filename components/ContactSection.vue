<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useSupabaseClient } from '#imports'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)

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
    const supabase = useSupabaseClient()
    
    // Use a simpler approach without type definitions
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        name: form.value.name,
        email: form.value.email,
        message: form.value.message
      }] as any)
      .select('id')

    if (error) throw error
    
    // Log success with message ID
    console.log('Message inserted with ID:', data[0].id)
    
    // Reset form on success
    form.value = { name: '', email: '', message: '' }
    isSuccess.value = true
  } catch (err) {
    if (err instanceof Error) {
      errorMessage.value = err.message || 'Failed to send message. Please try again.'
    } else {
      errorMessage.value = 'Failed to send message. Please try again.'
    }
    
    // Log error for debugging
    console.error('Supabase error:', err)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await nextTick()
  if (!sectionRef.value) return
  const element: Element = sectionRef.value as Element
  
  const ctx = gsap.context(() => {

    // Label slide
    gsap.from('.contact-label', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
      x: -40, opacity: 0, duration: 0.8, ease: 'power3.out'
    })

    // Let's Talk clip-path reveal
    gsap.from('.contact-title', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 75%' },
      y: 100, opacity: 0, duration: 1.2,
      ease: 'power4.out', delay: 0.1
    })

    // Subtext + Contacts stagger
    gsap.from('.contact-reveal', {
      scrollTrigger: { trigger: sectionRef.value, start: 'top 72%' },
      y: 30, opacity: 0, duration: 1, stagger: 0.15,
      ease: 'power3.out', delay: 0.3
    })

    // Form container slide + border animation
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

  }, element)

  ScrollTrigger.refresh()

  onUnmounted(() => {
    ctx.revert()
  })
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="py-32 relative bg-black/80 text-white overflow-hidden border-t border-white/5 backdrop-blur-[2px]">
    <!-- Section glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
    
    <div class="container mx-auto px-6 md:px-12 relative z-10">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        <!-- Left Side: Massive Typography -->
        <div class="lg:col-span-5 flex flex-col">
          <span class="contact-label text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-8 block">05 — Connect</span>
          <h2 class="contact-title text-[15vw] lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] mb-8 lg:mb-12">
            Let's<br/>Talk.
          </h2>
          <p class="contact-reveal text-lg md:text-2xl font-light text-neutral-400 max-w-sm mb-12">
            Have a cool project in mind? Looking for a developer? Send me a message and let's build something exceptional together.
          </p>

          <div class="flex flex-col gap-8 contact-reveal">
            <div class="flex flex-col gap-1 border-l-2 border-white/10 pl-6 hover:border-white/40 transition-colors">
              <span class="text-xs uppercase tracking-widest text-neutral-600 font-bold">Email</span>
              <a href="mailto:roshaanmustafa1@gmail.com" class="text-xl md:text-2xl font-light hover:text-neutral-300 transition-colors">roshaanmustafa1@gmail.com</a>
            </div>
            <div class="flex flex-col gap-1 border-l-2 border-white/10 pl-6 hover:border-white/40 transition-colors">
              <span class="text-xs uppercase tracking-widest text-neutral-600 font-bold">Phone</span>
              <a href="tel:+923134781894" class="text-xl md:text-2xl font-light hover:text-neutral-300 transition-colors">+92 313 4781894</a>
            </div>
          </div>
        </div>

        <!-- Right Side: The Form -->
        <div class="lg:col-span-7 contact-form-card bg-white/[0.03] border border-white/8 p-8 md:p-16 rounded-[40px] mt-12 lg:-mt-12 backdrop-blur-md">
          <div v-if="isSuccess" class="flex flex-col items-center justify-center text-center h-full py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-4xl font-bold text-white mb-4">Thank You!</h3>
            <p class="text-xl text-neutral-300">Your message has been sent successfully.</p>
            <p class="text-lg text-neutral-500 mt-2">I'll get back to you soon.</p>
          </div>
          
          <form v-else @submit.prevent="submitForm" class="flex flex-col gap-12">
            
            <div class="contact-input-wrap flex flex-col gap-4">
              <label class="text-sm uppercase tracking-widest text-neutral-500 font-bold">Your Name</label>
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="What's your name?" 
                class="w-full bg-transparent text-xl md:text-3xl font-light text-white outline-none border-b border-white/15 pb-4 focus:border-white/50 transition-colors placeholder:text-neutral-700"
                required
              />
            </div>

            <div class="contact-input-wrap flex flex-col gap-4">
              <label class="text-sm uppercase tracking-widest text-neutral-500 font-bold">Your Email</label>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="What's your email address?" 
                class="w-full bg-transparent text-xl md:text-3xl font-light text-white outline-none border-b border-white/15 pb-4 focus:border-white/50 transition-colors placeholder:text-neutral-700"
                required
              />
            </div>

            <div class="contact-input-wrap flex flex-col gap-4">
              <label class="text-sm uppercase tracking-widest text-neutral-500 font-bold">Project Details</label>
              <textarea 
                v-model="form.message" 
                placeholder="Tell me about your vision..." 
                rows="4"
                class="w-full bg-transparent text-xl md:text-3xl font-light text-white outline-none border-b border-white/15 pb-4 focus:border-white/50 transition-colors placeholder:text-neutral-700 resize-none"
                required
              ></textarea>
            </div>

            <div class="contact-input-wrap flex justify-start mt-6">
              <button type="submit" :disabled="isSubmitting" class="group relative inline-flex items-center justify-center py-6 px-12 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:scale-[1.05] active:scale-[0.98] transition-all overflow-hidden disabled:opacity-50">
                <span class="relative z-10 flex items-center gap-4">
                  {{ isSubmitting ? 'Sending Request...' : 'Send Message' }}
                  <svg v-if="!isSubmitting" width="20" height="20" viewBox="0 0 24 24" fill="none" class="group-hover:translate-x-2 transition-transform duration-300" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </span>
              </button>
            </div>
            
            <div v-if="errorMessage" class="mt-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300">
              {{ errorMessage }}
            </div>

          </form>
        </div>

      </div>

    </div>
  </section>
</template>
