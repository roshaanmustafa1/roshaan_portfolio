<script setup lang="ts">
import { ref } from 'vue'
import CMSCard from '~/components/admin/ui/CMSCard.vue'
import CMSInput from '~/components/admin/ui/CMSInput.vue'
import AdminImageUploader from '~/components/admin/ImageUploader.vue'
import { PanelTop, Link, LayoutList } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const saving = ref(false)
const saved = ref(false)

// Mock Data
const headerData = ref({
  logoText: 'Roshaan',
  logoUrl: '/Roshaan_Logo_white.svg',
  ctaText: 'Hire Me',
  ctaLink: '#contact'
})

const navLinks = ref([
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
])

const handleSave = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  }, 800)
}

// Mock upload function
const mockUpload = async (file: File) => {
  return URL.createObjectURL(file) // just for preview
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-2">
          <PanelTop class="w-6 h-6 text-violet-400" />
          Header Configuration
        </h1>
        <p class="text-sm text-gray-400 mt-1">Manage your website's navigation bar and branding.</p>
      </div>
      <button 
        @click="handleSave"
        class="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        :disabled="saving"
      >
        <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span v-else>{{ saved ? 'Saved!' : 'Save Changes' }}</span>
      </button>
    </div>

    <!-- General Settings -->
    <CMSCard title="Branding & Logo" description="Update your portfolio logo and primary text." :icon="PanelTop">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-6">
          <CMSInput v-model="headerData.logoText" label="Logo Alt Text / Fallback" placeholder="e.g. John Doe Portfolio" />
          <div class="grid grid-cols-2 gap-4">
            <CMSInput v-model="headerData.ctaText" label="Call to Action (Button) Text" placeholder="e.g. Hire Me" />
            <CMSInput v-model="headerData.ctaLink" label="Call to Action Link" placeholder="e.g. #contact" />
          </div>
        </div>
        <div>
          <AdminImageUploader 
            v-model="headerData.logoUrl" 
            label="Navbar Logo (SVG/PNG)" 
            :upload-fn="mockUpload"
            accept=".svg,.png,.webp"
          />
        </div>
      </div>
    </CMSCard>

    <!-- Navigation Links -->
    <CMSCard title="Navigation Links" description="Manage the links shown in your header." :icon="LayoutList">
      <div class="space-y-4">
        <div v-for="(link, index) in navLinks" :key="index" class="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5 relative group">
          <div class="flex-1 grid grid-cols-2 gap-4">
            <CMSInput v-model="link.name" label="Link Name" placeholder="e.g. About" />
            <CMSInput v-model="link.href" label="Link Target (URL or ID)" placeholder="e.g. #about" />
          </div>
          <button @click="navLinks.splice(index, 1)" class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg mt-6 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Link">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
        
        <button @click="navLinks.push({ name: '', href: '' })" class="w-full py-3 border-2 border-dashed border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all rounded-xl text-gray-400 hover:text-violet-400 text-sm font-medium flex items-center justify-center gap-2">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Add Navigation Link
        </button>
      </div>
    </CMSCard>
  </div>
</template>
