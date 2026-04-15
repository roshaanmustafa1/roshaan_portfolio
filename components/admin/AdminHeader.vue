<script setup lang="ts">
// components/admin/AdminHeader.vue
// ─────────────────────────────────────────────────────────────────────────────
// Top header bar: page title, user info and sidebar toggle button.
// useSupabaseUser() provides the authenticated user from Supabase session.
// ─────────────────────────────────────────────────────────────────────────────
defineEmits<{ (e: 'toggle-sidebar'): void }>()

const route = useRoute()

// ── SUPABASE: reactive user object from current auth session ───────────────
const user = useSupabaseUser()

// Derive a human-readable page title from the route path
const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path === '/admin/projects') return 'Projects'
  if (path.includes('/admin/projects/')) return route.params.id === 'new' ? 'New Project' : 'Edit Project'
  if (path === '/admin/profile') return 'Profile Settings'
  if (path === '/admin/messages') return 'Messages'
  return 'Admin'
})

const currentTime = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  })
})
</script>

<template>
  <header class="h-16 bg-[#0D0D14]/80 backdrop-blur-sm border-b border-white/5 flex items-center px-6 gap-4 sticky top-0 z-10">
    <!-- ── Hamburger / Menu toggle ─────────────────────────────────────────── -->
    <button
      class="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      @click="$emit('toggle-sidebar')"
    >
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>

    <!-- ── Page Title ─────────────────────────────────────────────────────── -->
    <div class="flex-1">
      <h1 class="text-white font-semibold text-base">{{ pageTitle }}</h1>
      <p class="text-gray-500 text-xs">{{ currentTime }}</p>
    </div>

    <!-- ── User Info ──────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-3">
      <!-- Notification bell (decorative) -->
      <button class="relative p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        <!-- Unread dot -->
        <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
      </button>

      <!-- User avatar + email -->
      <div class="flex items-center gap-2.5 pl-3 border-l border-white/5">
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <span class="text-white text-xs font-bold uppercase">
            {{ user?.email?.charAt(0) ?? 'A' }}
          </span>
        </div>
        <span class="text-gray-400 text-xs hidden sm:block max-w-[140px] truncate">
          {{ user?.email ?? 'Admin' }}
        </span>
      </div>
    </div>
  </header>
</template>
