<script setup lang="ts">
// pages/admin/profile.vue
// ─────────────────────────────────────────────────────────────────────────────
// Profile / Hero section editor.
// Reads from and writes to the `profile` table in Supabase (single row, id=1).
// Avatar upload goes to Supabase Storage via useProfileStore.
// ─────────────────────────────────────────────────────────────────────────────
definePageMeta({ layout: 'admin', middleware: ['auth'] })

const store = useProfileStore()

// ── SUPABASE API CALL: Load profile on mount ──────────────────────────────
onMounted(() => store.fetchProfile())

// Local form copy (avoids mutating store directly while typing)
const form = reactive({
  full_name: '',
  title: '',
  short_bio: '',
  long_bio: '',
  github_url: '',
  linkedin_url: '',
  twitter_url: '',
  website_url: '',
  avatar_url: '',
})

// Sync form from store once data loads
watch(
  () => store.profile,
  (profile) => {
    Object.assign(form, profile)
  },
  { immediate: true, deep: true }
)

// Validate
const errors = reactive({ full_name: '', title: '' })
const validate = () => {
  errors.full_name = form.full_name.trim() ? '' : 'Full name is required.'
  errors.title = form.title.trim() ? '' : 'Professional title is required.'
  return !errors.full_name && !errors.title
}

const handleSave = async () => {
  if (!validate()) return
  // ── SUPABASE API CALL: Upsert profile row ────────────────────────────────
  await store.saveProfile({ ...form })
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- ── Page header ────────────────────────────────────────────────────── -->
    <div>
      <h2 class="text-xl font-bold text-white">Profile Settings</h2>
      <p class="text-gray-500 text-sm mt-1">Update your public portfolio profile — changes appear on your live site.</p>
    </div>

    <!-- ── Success banner ─────────────────────────────────────────────────── -->
    <Transition name="slide-down">
      <div v-if="store.savedSuccess" class="flex items-center gap-2.5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <svg class="w-4 h-4 text-emerald-400 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
        <p class="text-emerald-400 text-sm font-medium">Profile saved successfully!</p>
      </div>
    </Transition>

    <!-- ── Error banner ───────────────────────────────────────────────────── -->
    <Transition name="slide-down">
      <div v-if="store.error" class="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p class="text-red-400 text-sm">{{ store.error }}</p>
      </div>
    </Transition>

    <!-- ── Avatar Upload ──────────────────────────────────────────────────── -->
    <div class="bg-[#0D0D14] border border-white/5 rounded-xl p-6">
      <h3 class="text-white font-semibold text-sm mb-4">Profile Avatar</h3>
      <!-- ── SUPABASE STORAGE: store.uploadAvatar uploads to 'project-images/avatars/' ── -->
      <AdminImageUploader
        v-model="form.avatar_url"
        label="Avatar / Profile Photo"
        :upload-fn="store.uploadAvatar"
        accept="image/*"
      />
    </div>

    <!-- ── Basic info ─────────────────────────────────────────────────────── -->
    <div class="bg-[#0D0D14] border border-white/5 rounded-xl p-6 space-y-5">
      <h3 class="text-white font-semibold text-sm">Basic Information</h3>

      <!-- Full name -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">
          Full Name <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.full_name"
          type="text"
          placeholder="Roshaan Moeez Mustafa"
          class="admin-input"
          :class="errors.full_name ? 'border-red-500/50' : ''"
        />
        <p v-if="errors.full_name" class="mt-1 text-xs text-red-400">{{ errors.full_name }}</p>
      </div>

      <!-- Professional title -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">
          Professional Title <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Full Stack Developer · UI/UX Designer"
          class="admin-input"
          :class="errors.title ? 'border-red-500/50' : ''"
        />
        <p v-if="errors.title" class="mt-1 text-xs text-red-400">{{ errors.title }}</p>
        <p class="mt-1.5 text-xs text-gray-600">Displayed below your name in the Hero section.</p>
      </div>

      <!-- Short bio (hero tagline) -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">Short Bio / Tagline</label>
        <input
          v-model="form.short_bio"
          type="text"
          placeholder="Building elegant digital experiences..."
          class="admin-input"
        />
        <p class="mt-1.5 text-xs text-gray-600">A one-liner shown in the hero section or meta description.</p>
      </div>

      <!-- Long bio -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">About / Long Bio</label>
        <textarea
          v-model="form.long_bio"
          rows="5"
          placeholder="I'm a passionate developer who loves crafting beautiful, performant web applications..."
          class="admin-input resize-none"
        />
        <p class="mt-1.5 text-xs text-gray-600">Full biography for the About section. Markdown supported in the future.</p>
      </div>
    </div>

    <!-- ── Social links ───────────────────────────────────────────────────── -->
    <div class="bg-[#0D0D14] border border-white/5 rounded-xl p-6 space-y-4">
      <h3 class="text-white font-semibold text-sm">Social & Link</h3>

      <!-- GitHub -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">GitHub URL</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
          </div>
          <input v-model="form.github_url" type="url" placeholder="https://github.com/yourusername" class="admin-input pl-10" />
        </div>
      </div>

      <!-- LinkedIn -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">LinkedIn URL</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </div>
          <input v-model="form.linkedin_url" type="url" placeholder="https://linkedin.com/in/yourusername" class="admin-input pl-10" />
        </div>
      </div>

      <!-- Twitter/X -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">Twitter / X URL</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </div>
          <input v-model="form.twitter_url" type="url" placeholder="https://x.com/yourusername" class="admin-input pl-10" />
        </div>
      </div>

      <!-- Personal website -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">Personal Website / Blog</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" /></svg>
          </div>
          <input v-model="form.website_url" type="url" placeholder="https://yourwebsite.com" class="admin-input pl-10" />
        </div>
      </div>
    </div>

    <!-- ── Save button ─────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-3 pb-4">
      <button
        class="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold
               rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/25 flex items-center gap-2
               disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="store.saving"
        @click="handleSave"
      >
        <svg v-if="store.saving" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ store.saving ? 'Saving...' : 'Save Profile' }}
      </button>
      <button
        class="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 text-sm rounded-lg transition-colors"
        @click="store.fetchProfile()"
      >
        Discard Changes
      </button>
    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
