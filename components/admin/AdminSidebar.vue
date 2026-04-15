<script setup lang="ts">
// components/admin/AdminSidebar.vue
// ─────────────────────────────────────────────────────────────────────────────
// Dark sidebar with navigation links and logout.
// Supabase signOut() is called on the logout button click.
// ─────────────────────────────────────────────────────────────────────────────
defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const route = useRoute()
// ── SUPABASE: signOut via @nuxtjs/supabase composable ─────────────────────
const supabase = useSupabaseClient()

const navItems = [
  { label: 'Dashboard',        icon: 'LayoutDashboard', href: '/admin' },
  { label: 'Projects',         icon: 'FolderKanban',    href: '/admin/projects' },
  { label: 'Profile Settings', icon: 'UserCircle',      href: '/admin/profile' },
  { label: 'Messages',         icon: 'MessageSquare',   href: '/admin/messages' },
]

const isActive = (href: string) => {
  if (href === '/admin') return route.path === '/admin'
  return route.path.startsWith(href)
}

const handleLogout = async () => {
  // ── SUPABASE API CALL: Sign out the current user and clear session ───────
  await supabase.auth.signOut()
  navigateTo('/admin/login')
}
</script>

<template>
  <!-- Fixed sidebar with smooth slide transition -->
  <aside
    class="fixed top-0 left-0 h-full w-64 bg-[#0D0D14] border-r border-white/5 z-30
           flex flex-col transition-transform duration-300"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- ── Brand ──────────────────────────────────────────────────────────── -->
    <div class="px-6 py-5 border-b border-white/5">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <span class="text-white text-sm font-bold">R</span>
        </div>
        <div>
          <p class="text-white font-semibold text-sm leading-none">Roshaan</p>
          <p class="text-[11px] text-violet-400 mt-0.5 font-medium tracking-wide uppercase">Admin Panel</p>
        </div>
      </div>
    </div>

    <!-- ── Navigation ─────────────────────────────────────────────────────── -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               transition-all duration-200 group"
        :class="isActive(item.href)
          ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'"
        @click="$emit('close')"
      >
        <!-- Icon using lucide icons -->
        <span class="w-4 h-4 shrink-0" :class="isActive(item.href) ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300'">
          <svg v-if="item.icon === 'LayoutDashboard'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          <svg v-if="item.icon === 'FolderKanban'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
          <svg v-if="item.icon === 'UserCircle'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <svg v-if="item.icon === 'MessageSquare'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
        </span>
        {{ item.label }}

        <!-- Active indicator dot -->
        <span v-if="isActive(item.href)" class="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
      </NuxtLink>
    </nav>

    <!-- ── Logout ───────────────────────────────────────────────────────── -->
    <div class="px-3 pb-5 pt-2 border-t border-white/5">
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        @click="handleLogout"
      >
        <svg class="w-4 h-4 shrink-0 text-gray-500 group-hover:text-red-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        Sign Out
      </button>
    </div>
  </aside>
</template>
