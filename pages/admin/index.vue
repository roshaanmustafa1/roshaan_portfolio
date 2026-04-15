<script setup lang="ts">
// pages/admin/index.vue
// ─────────────────────────────────────────────────────────────────────────────
// Admin Dashboard — overview with stats and recent projects.
// Protected by auth middleware via the admin layout.
// ─────────────────────────────────────────────────────────────────────────────
definePageMeta({ layout: 'admin', middleware: ['auth'] })

// ── Stores ───────────────────────────────────────────────────────────────────
const projectsStore = useProjectsStore()
const profileStore = useProfileStore()

// ── SUPABASE API CALL: Fetch data on mount ────────────────────────────────
onMounted(async () => {
  await Promise.all([
    projectsStore.fetchProjects(),
    profileStore.fetchProfile(),
  ])
})

// ── Derived stats ─────────────────────────────────────────────────────────
const totalProjects = computed(() => projectsStore.projects.length)
const featuredProjects = computed(() => projectsStore.projects.filter(p => p.featured).length)
const recentProjects = computed(() => projectsStore.projects.slice(0, 5))

const lastUpdated = computed(() => {
  if (!profileStore.profile.updated_at) return 'Never'
  return new Date(profileStore.profile.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  })
})
</script>

<template>
  <div class="space-y-8">
    <!-- ── Welcome banner ─────────────────────────────────────────────────── -->
    <div class="relative bg-gradient-to-r from-violet-600/15 to-indigo-600/10 border border-violet-500/15 rounded-2xl p-6 overflow-hidden">
      <div class="absolute right-4 top-4 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl -z-0" />
      <div class="relative z-10">
        <p class="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">Welcome back</p>
        <h2 class="text-2xl font-bold text-white">
          {{ profileStore.profile.full_name || 'Admin' }}
          <span class="text-gray-500 text-lg font-normal"> — {{ profileStore.profile.title || 'Portfolio Owner' }}</span>
        </h2>
        <p class="text-gray-400 text-sm mt-1 max-w-lg">
          {{ profileStore.profile.short_bio || 'Manage your portfolio, projects, and profile settings from this dashboard.' }}
        </p>
      </div>
    </div>

    <!-- ── Stat cards ─────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminStatCard
        label="Total Projects"
        :value="totalProjects"
        icon="projects"
        color="violet"
        trend="+Active"
      />
      <AdminStatCard
        label="Featured"
        :value="featuredProjects"
        icon="projects"
        color="blue"
      />
      <AdminStatCard
        label="Profile"
        value="Live"
        icon="profile"
        color="emerald"
        trend="Public"
      />
      <AdminStatCard
        label="Last Updated"
        :value="lastUpdated"
        icon="updated"
        color="amber"
      />
    </div>

    <!-- ── Quick actions ──────────────────────────────────────────────────── -->
    <div>
      <h3 class="text-white font-semibold mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <NuxtLink
          to="/admin/projects/new"
          class="flex flex-col items-center gap-2 p-4 bg-[#0D0D14] border border-white/5
                 rounded-xl hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200 group text-center"
        >
          <div class="p-2 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
            <svg class="w-5 h-5 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </div>
          <span class="text-sm text-gray-300 font-medium">Add Project</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/profile"
          class="flex flex-col items-center gap-2 p-4 bg-[#0D0D14] border border-white/5
                 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200 group text-center"
        >
          <div class="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
            <svg class="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </div>
          <span class="text-sm text-gray-300 font-medium">Edit Profile</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/messages"
          class="flex flex-col items-center gap-2 p-4 bg-[#0D0D14] border border-white/5
                 rounded-xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200 group text-center"
        >
          <div class="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
            <svg class="w-5 h-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
          </div>
          <span class="text-sm text-gray-300 font-medium">View Messages</span>
        </NuxtLink>

        <NuxtLink
          to="/"
          target="_blank"
          class="flex flex-col items-center gap-2 p-4 bg-[#0D0D14] border border-white/5
                 rounded-xl hover:border-white/20 hover:bg-white/[0.02] transition-all duration-200 group text-center"
        >
          <div class="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </div>
          <span class="text-sm text-gray-300 font-medium">View Portfolio</span>
        </NuxtLink>
      </div>
    </div>

    <!-- ── Recent projects table ──────────────────────────────────────────── -->
    <div class="bg-[#0D0D14] border border-white/5 rounded-xl overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 class="text-white font-semibold text-sm">Recent Projects</h3>
        <NuxtLink to="/admin/projects" class="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
          View all →
        </NuxtLink>
      </div>

      <!-- Loading skeleton -->
      <div v-if="projectsStore.loading" class="p-5 space-y-3">
        <div v-for="i in 3" :key="i" class="h-10 bg-white/3 rounded-lg animate-pulse" />
      </div>

      <!-- Empty state -->
      <div v-else-if="!recentProjects.length" class="py-12 text-center">
        <svg class="w-10 h-10 text-gray-700 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
        <p class="text-gray-500 text-sm">No projects yet</p>
        <NuxtLink to="/admin/projects/new" class="mt-3 inline-block text-xs text-violet-400 hover:text-violet-300 transition-colors">
          Add your first project →
        </NuxtLink>
      </div>

      <!-- Projects list -->
      <div v-else class="divide-y divide-white/5">
        <div
          v-for="project in recentProjects"
          :key="project.id"
          class="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
        >
          <!-- Thumbnail -->
          <div class="w-10 h-10 rounded-lg overflow-hidden bg-[#080810] shrink-0">
            <img v-if="project.image_url" :src="project.image_url" :alt="project.title" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            </div>
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-200 truncate">{{ project.title }}</p>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-for="tech in project.tech_stack.slice(0, 3)" :key="tech" class="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">{{ tech }}</span>
            </div>
          </div>
          <!-- Edit button -->
          <NuxtLink :to="`/admin/projects/${project.id}`" class="p-1.5 text-gray-600 hover:text-violet-400 transition-colors shrink-0">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
