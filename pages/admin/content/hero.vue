<script setup lang="ts">
import { ref } from 'vue'
import CMSCard from '~/components/admin/ui/CMSCard.vue'
import CMSInput from '~/components/admin/ui/CMSInput.vue'
import CMSTextarea from '~/components/admin/ui/CMSTextarea.vue'
import { Image as ImageIcon, Briefcase, Type, MessageSquareText } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const saving = ref(false)
const saved = ref(false)

// Mock Data
const heroData = ref({
  location: 'Lahore, PK',
  status: 'Open to Work',
  phone: '+92 313 4781894',
  email: 'roshaanmustafa1@gmail.com',
  topLabel: 'Roshaan Mustafa',
  headingLine1: 'Developer',
  headingLine2: '& Designer.',
  bio: 'Passioned about the intersection of elegant UI and high-performance code. Building exceptional web experiences with Vue, React & WordPress since 2020.',
})

// Typewriter Roles List
const typewriterRoles = ref([
  'Frontend Engineer', 
  'UI/UX Designer', 
  'WordPress Expert', 
  'Vue & React Dev'
])

// Buttons Configuration
const ctaButtons = ref([
  { label: 'View Work', href: '#projects', style: 'Solid White' },
  { label: 'Hire Me', href: '#contact', style: 'Outline' }
])

const handleSave = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  }, 800)
}
</script>

<template>
  <div class="space-y-6 max-w-4xl pb-10">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-2">
          <ImageIcon class="w-6 h-6 text-violet-400" />
          Hero Section
        </h1>
        <p class="text-sm text-gray-400 mt-1">Manage the first thing visitors see on your portfolio.</p>
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

    <!-- Status Bar Info -->
    <CMSCard title="Status & Contact Info" description="Information displayed at the very top of the Hero." :icon="Briefcase">
      <div class="grid md:grid-cols-2 gap-6">
        <CMSInput v-model="heroData.status" label="Availability Status" placeholder="e.g. Open to Work" />
        <CMSInput v-model="heroData.location" label="Location" placeholder="e.g. Lahore, PK" />
        <CMSInput v-model="heroData.email" label="Contact Email" type="email" placeholder="e.g. hello@domain.com" />
        <CMSInput v-model="heroData.phone" label="Phone Number" type="tel" placeholder="e.g. +1 234 567 890" />
      </div>
    </CMSCard>

    <!-- Main Headings -->
    <CMSCard title="Main Headings" description="The primary massive text block." :icon="Type">
      <div class="space-y-6">
        <CMSInput v-model="heroData.topLabel" label="Top Sub-Label" placeholder="e.g. Roshaan Mustafa" />
        
        <div class="grid md:grid-cols-2 gap-6">
          <CMSInput v-model="heroData.headingLine1" label="Heading Line 1 (Solid)" placeholder="e.g. Developer" hint="Rendered as solid white text." />
          <CMSInput v-model="heroData.headingLine2" label="Heading Line 2 (Outlined)" placeholder="e.g. & Designer." hint="Rendered with a transparent outline effect." />
        </div>
      </div>
    </CMSCard>

    <!-- Biograph & Typewriter -->
    <CMSCard title="Biography & Typing Effect" description="Intro text and animated roles array." :icon="MessageSquareText">
      <div class="space-y-6">
        <!-- Textarea -->
        <CMSTextarea v-model="heroData.bio" label="Short Biography" placeholder="Passionate about..." rows="3" />

        <!-- Typewriter list -->
        <div class="space-y-3 pt-4 border-t border-white/5">
          <label class="block text-sm font-medium text-gray-300">Typewriter Roles</label>
          <div class="flex flex-col gap-2">
            <div v-for="(role, idx) in typewriterRoles" :key="idx" class="flex items-center gap-2">
              <span class="text-xs text-gray-500 font-mono w-6">{{ idx + 1 }}.</span>
              <CMSInput v-model="typewriterRoles[idx]" class="flex-1" />
              <button @click="typewriterRoles.splice(idx, 1)" class="p-2 text-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-colors rounded-lg">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            <button @click="typewriterRoles.push('')" class="text-xs font-medium text-violet-400 hover:text-violet-300 py-2 inline-flex items-center gap-1 w-fit mt-1">
              + Add Role
            </button>
          </div>
        </div>
      </div>
    </CMSCard>

    <!-- Call to Actions -->
    <CMSCard title="Hero Buttons" description="The two call-to-action buttons below the bio.">
      <div class="space-y-4">
        <div v-for="(btn, idx) in ctaButtons" :key="idx" class="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex gap-4">
          <div class="flex-1 grid grid-cols-2 gap-4">
            <CMSInput v-model="btn.label" label="Button Label" />
            <CMSInput v-model="btn.href" label="Button Link Target" />
          </div>
          <div class="w-1/3">
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Button Style</label>
            <select v-model="btn.style" class="w-full bg-[#080810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all">
              <option>Solid White</option>
              <option>Outline</option>
              <option>Primary Violet</option>
            </select>
          </div>
        </div>
      </div>
    </CMSCard>
  </div>
</template>
