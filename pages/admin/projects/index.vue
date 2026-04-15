<script setup lang="ts">
// pages/admin/projects/index.vue
// ─────────────────────────────────────────────────────────────────────────────
// Projects list page — grid + table toggle view.
// Supabase CRUD operations delegated to useProjectsStore.
// ─────────────────────────────────────────────────────────────────────────────
definePageMeta({ layout: 'admin', middleware: ['auth'] })

const store = useProjectsStore()
const router = useRouter()

// ── UI state ──────────────────────────────────────────────────────────────────
const viewMode = ref<'grid' | 'table'>('grid')
const searchQuery = ref('')
const showDeleteModal = ref(false)
const projectToDelete = ref<string | null>(null)

// ── SUPABASE API CALL: Fetch all projects on mount ────────────────────────
onMounted(() => store.fetchProjects())

// Filter projects by search query
const filteredProjects = computed(() => {
  if (!searchQuery.value) return store.projects
  const q = searchQuery.value.toLowerCase()
  return store.projects.filter(
    p => p.title.toLowerCase().includes(q) || p.tech_stack.some(t => t.toLowerCase().includes(q))
  )
})

const confirmDelete = (id: string) => {
  projectToDelete.value = id
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!projectToDelete.value) return
  // ── SUPABASE API CALL: Delete project by ID ─────────────────────────────
  await store.deleteProject(projectToDelete.value)
  showDeleteModal.value = false
  projectToDelete.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- ── Top Bar ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <!-- Search -->
      <div class="relative flex-1 max-w-sm">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </div>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search projects..."
          class="w-full pl-9 pr-4 py-2 bg-[#0D0D14] border border-white/8 rounded-lg text-sm text-gray-300
                 placeholder:text-gray-600 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />
      </div>

      <div class="flex items-center gap-3 sm:ml-auto">
        <!-- View toggle -->
        <div class="flex items-center bg-[#0D0D14] border border-white/8 rounded-lg p-0.5">
          <button
            class="p-1.5 rounded-md transition-colors"
            :class="viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'"
            title="Grid view"
            @click="viewMode = 'grid'"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          </button>
          <button
            class="p-1.5 rounded-md transition-colors"
            :class="viewMode === 'table' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'"
            title="Table view"
            @click="viewMode = 'table'"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" /></svg>
          </button>
        </div>

        <!-- Add new button -->
        <NuxtLink
          to="/admin/projects/new"
          class="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm
                 font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/25"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Project
        </NuxtLink>
      </div>
    </div>

    <!-- ── Loading state ──────────────────────────────────────────────────── -->
    <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="h-64 bg-[#0D0D14] border border-white/5 rounded-xl animate-pulse" />
    </div>

    <!-- ── Empty state ────────────────────────────────────────────────────── -->
    <div v-else-if="!filteredProjects.length" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 bg-[#0D0D14] border border-white/5 rounded-2xl flex items-center justify-center mb-4">
        <svg class="w-7 h-7 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
      </div>
      <h3 class="text-white font-semibold mb-2">{{ searchQuery ? 'No results found' : 'No projects yet' }}</h3>
      <p class="text-gray-500 text-sm mb-5">
        {{ searchQuery ? 'Try a different search term.' : 'Add your first project to get started.' }}
      </p>
      <NuxtLink v-if="!searchQuery" to="/admin/projects/new" class="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
        Add Project
      </NuxtLink>
    </div>

    <!-- ── GRID view ───────────────────────────────────────────────────────── -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AdminProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        @edit="router.push(`/admin/projects/${$event}`)"
        @delete="confirmDelete($event)"
      />
    </div>

    <!-- ── TABLE view ──────────────────────────────────────────────────────── -->
    <div v-else class="bg-[#0D0D14] border border-white/5 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tech Stack</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="project in filteredProjects" :key="project.id" class="hover:bg-white/[0.02] transition-colors">
            <!-- Project name + image -->
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg overflow-hidden bg-[#080810] shrink-0">
                  <img v-if="project.image_url" :src="project.image_url" :alt="project.title" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="font-medium text-gray-200">{{ project.title }}</p>
                  <p class="text-xs text-gray-600 line-clamp-1 max-w-[200px]">{{ project.description }}</p>
                </div>
              </div>
            </td>
            <!-- Tech stack -->
            <td class="px-4 py-3.5 hidden md:table-cell">
              <div class="flex flex-wrap gap-1">
                <span v-for="tech in project.tech_stack.slice(0, 3)" :key="tech" class="px-1.5 py-0.5 bg-white/5 text-gray-500 text-[11px] rounded">{{ tech }}</span>
                <span v-if="project.tech_stack.length > 3" class="text-gray-600 text-[11px] px-1">+{{ project.tech_stack.length - 3 }}</span>
              </div>
            </td>
            <!-- Date -->
            <td class="px-4 py-3.5 text-gray-500 text-xs hidden lg:table-cell">
              {{ project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }}
            </td>
            <!-- Featured badge -->
            <td class="px-4 py-3.5">
              <span
                class="px-2 py-0.5 text-xs rounded-full font-medium"
                :class="project.featured ? 'bg-violet-500/15 text-violet-400' : 'bg-white/5 text-gray-600'"
              >
                {{ project.featured ? 'Yes' : 'No' }}
              </span>
            </td>
            <!-- Actions -->
            <td class="px-4 py-3.5">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="`/admin/projects/${project.id}`" class="p-1.5 text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-colors">
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                </NuxtLink>
                <button class="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" @click="confirmDelete(project.id!)">
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Delete confirmation modal ─────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showDeleteModal = false">
          <div class="bg-[#0D0D14] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-red-500/15 rounded-lg">
                <svg class="w-5 h-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <h3 class="text-white font-semibold">Delete Project?</h3>
            </div>
            <p class="text-gray-400 text-sm mb-6">This action cannot be undone. The project and its associated data will be permanently removed from Supabase.</p>
            <div class="flex gap-3">
              <button class="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-colors" @click="showDeleteModal = false">
                Cancel
              </button>
              <button
                class="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                :disabled="store.loading"
                @click="executeDelete"
              >
                <svg v-if="store.loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div, .modal-leave-to > div { transform: scale(0.95); }
</style>
