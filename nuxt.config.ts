// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/Roshaan_Logo.svg' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/Roshaan.png' },
      ],
    },
  },
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@vueuse/motion/nuxt',
    'shadcn-nuxt',
    '@pinia/nuxt',
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
})
