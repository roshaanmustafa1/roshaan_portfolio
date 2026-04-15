<script setup lang="ts">
// components/admin/ProjectCard.vue
// ─────────────────────────────────────────────────────────────────────────────
// Grid card for a single project in the projects list.
// ─────────────────────────────────────────────────────────────────────────────
import type { Project } from '~/stores/useProjectsStore'

defineProps<{ project: Project }>()
defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

const formattedDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}
</script>

<template>
  <div class="group bg-[#0D0D14] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-200">
    <!-- ── Cover Image ──────────────────────────────────────────────────── -->
    <div class="relative h-44 bg-[#080810] overflow-hidden">
      <img
        v-if="project.image_url"
        :src="project.image_url"
        :alt="project.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <!-- Placeholder when no image -->
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>

      <!-- Featured badge -->
      <div v-if="project.featured" class="absolute top-3 left-3 px-2 py-0.5 bg-violet-500/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
        Featured
      </div>

      <!-- Action buttons overlay (visible on hover) -->
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button
          class="p-2 bg-violet-500/20 text-violet-300 rounded-lg hover:bg-violet-500/40 transition-colors backdrop-blur-sm"
          title="Edit Project"
          @click="$emit('edit', project.id!)"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
        <button
          class="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors backdrop-blur-sm"
          title="Delete Project"
          @click="$emit('delete', project.id!)"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Content ─────────────────────────────────────────────────────── -->
    <div class="p-4">
      <h3 class="text-white font-semibold text-sm leading-snug mb-1.5 line-clamp-1">{{ project.title }}</h3>
      <p class="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{{ project.description }}</p>

      <!-- Tech tags -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="tech in project.tech_stack.slice(0, 4)"
          :key="tech"
          class="px-2 py-0.5 bg-white/5 text-gray-400 text-[11px] rounded-md"
        >{{ tech }}</span>
        <span v-if="project.tech_stack.length > 4" class="px-2 py-0.5 text-gray-600 text-[11px]">
          +{{ project.tech_stack.length - 4 }} more
        </span>
      </div>

      <!-- Links + date row -->
      <div class="flex items-center justify-between pt-3 border-t border-white/5">
        <div class="flex gap-2">
          <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="text-violet-400 hover:text-violet-300 transition-colors" title="Live Demo">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </a>
          <a v-if="project.github_url" :href="project.github_url" target="_blank" class="text-gray-400 hover:text-gray-200 transition-colors" title="GitHub">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
          </a>
        </div>
        <span class="text-gray-600 text-[11px]">{{ formattedDate(project.created_at) }}</span>
      </div>
    </div>
  </div>
</template>
