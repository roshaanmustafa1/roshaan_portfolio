// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/motion/nuxt',
    'shadcn-nuxt',
    // ─── Supabase: provides useSupabaseClient(), useSupabaseUser(), etc. ───
    '@nuxtjs/supabase',
    // ─── Pinia: global state management for admin panel stores ───
    '@pinia/nuxt',
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  // ─── Supabase module configuration ───────────────────────────────────────
  supabase: {
    redirect: false, // We handle redirects manually via middleware
    redirectOptions: {
      login: '/admin/login',
      callback: '/confirm',
      exclude: ['/', '/admin/login'],
    },
  },
})