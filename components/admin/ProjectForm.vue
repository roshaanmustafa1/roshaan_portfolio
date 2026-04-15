<script setup lang="ts">
// components/admin/ProjectForm.vue
// ─────────────────────────────────────────────────────────────────────────────
// Reusable form for adding and editing projects.
// All Supabase calls are delegated to useProjectsStore.
// Mode: 'add' | 'edit' — handled by the parent page.
// ─────────────────────────────────────────────────────────────────────────────
import type { Project } from '~/stores/useProjectsStore'

interface Props {
  initialData?: Partial<Project>
  mode?: 'add' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  initialData: () => ({}),
})

const emit = defineEmits<{
  (e: 'submit', project: Omit<Project, 'id' | 'created_at'>): void
  (e: 'cancel'): void
}>()

// ── Store ─────────────────────────────────────────────────────────────────────
const store = useProjectsStore()

// ── Form state ────────────────────────────────────────────────────────────────
const form = reactive<Omit<Project, 'id' | 'created_at'>>({
  title: props.initialData.title ?? '',
  description: props.initialData.description ?? '',
  tech_stack: props.initialData.tech_stack ?? [],
  demo_url: props.initialData.demo_url ?? '',
  github_url: props.initialData.github_url ?? '',
  image_url: props.initialData.image_url ?? '',
  featured: props.initialData.featured ?? false,
})

// Form validation errors
const errors = reactive({ title: '', description: '' })

const validate = (): boolean => {
  errors.title = form.title.trim() ? '' : 'Project title is required.'
  errors.description = form.description.trim() ? '' : 'Description is required.'
  return !errors.title && !errors.description
}

const handleSubmit = async () => {
  if (!validate()) return
  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- ── Project Title ─────────────────────────────────────────────────── -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1.5">
        Project Title <span class="text-red-400">*</span>
      </label>
      <input
        v-model="form.title"
        type="text"
        placeholder="e.g. E-Commerce Platform"
        class="admin-input"
        :class="errors.title ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10' : ''"
      />
      <p v-if="errors.title" class="mt-1 text-xs text-red-400">{{ errors.title }}</p>
    </div>

    <!-- ── Description ─────────────────────────────────────────────────── -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1.5">
        Description <span class="text-red-400">*</span>
      </label>
      <textarea
        v-model="form.description"
        rows="4"
        placeholder="Describe what this project does, the problem it solves, and key features..."
        class="admin-input resize-none"
        :class="errors.description ? 'border-red-500/50' : ''"
      />
      <p v-if="errors.description" class="mt-1 text-xs text-red-400">{{ errors.description }}</p>
    </div>

    <!-- ── Tech Stack ───────────────────────────────────────────────────── -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1.5">Tech Stack</label>
      <!-- ── Uses TechTagInput component for multi-tag input ────────── -->
      <AdminTechTagInput v-model="form.tech_stack" />
    </div>

    <!-- ── Cover Image ─────────────────────────────────────────────────── -->
    <div>
      <!-- ── SUPABASE STORAGE: uploadImage() from the store is passed as
               the uploadFn prop to ImageUploader. The component handles
               file selection/drag-drop, then calls this function. ──── -->
      <AdminImageUploader
        v-model="form.image_url"
        label="Cover Image"
        :upload-fn="store.uploadImage"
      />
    </div>

    <!-- ── URLs ────────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">Live Demo URL</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </div>
          <input v-model="form.demo_url" type="url" placeholder="https://your-demo.com" class="admin-input pl-10" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">GitHub Repository URL</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
          </div>
          <input v-model="form.github_url" type="url" placeholder="https://github.com/..." class="admin-input pl-10" />
        </div>
      </div>
    </div>

    <!-- ── Featured toggle ────────────────────────────────────────────── -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        :aria-checked="form.featured"
        class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        :class="form.featured ? 'bg-violet-500' : 'bg-white/10'"
        @click="form.featured = !form.featured"
      >
        <span
          class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
          :class="form.featured ? 'translate-x-4' : 'translate-x-1'"
        />
      </button>
      <label class="text-sm font-medium text-gray-300 cursor-pointer select-none" @click="form.featured = !form.featured">
        Featured Project
        <span class="text-gray-500 font-normal">(displayed prominently on portfolio)</span>
      </label>
    </div>

    <!-- ── Actions ────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-3 pt-2 border-t border-white/5">
      <button
        type="submit"
        class="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold
               rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/25 flex items-center gap-2
               disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="store.loading"
      >
        <svg v-if="store.loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ store.loading ? 'Saving...' : mode === 'add' ? 'Add Project' : 'Save Changes' }}
      </button>
      <button
        type="button"
        class="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-colors"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<style>
/* Global admin form input style — reused across all admin forms */
.admin-input {
  @apply w-full px-3.5 py-2.5 bg-[#080810] border border-white/10 rounded-lg text-sm text-gray-200
         placeholder:text-gray-600 outline-none transition-all duration-200
         focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20;
}
</style>
