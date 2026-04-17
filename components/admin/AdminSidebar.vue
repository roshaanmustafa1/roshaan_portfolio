<script setup lang="ts">
// components/admin/AdminSidebar.vue
// ─────────────────────────────────────────────────────────────────────────────
// CMS Sidebar with grouped navigation for content management.
// ─────────────────────────────────────────────────────────────────────────────
import {
  LayoutDashboard,
  PanelTop,
  Image as ImageIcon,
  Briefcase,
  Code,
  PanelBottom,
  FolderKanban,
  MessageSquare,
  UserCircle,
  LogOut
} from 'lucide-vue-next'

defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const route = useRoute()
const supabase = useSupabaseClient()

const navGroups = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' }
    ]
  },
  {
    title: 'Content CMS',
    items: [
      { label: 'Header', icon: PanelTop, href: '/admin/content/header' },
      { label: 'Hero Section', icon: ImageIcon, href: '/admin/content/hero' },
      { label: 'Experience', icon: Briefcase, href: '/admin/content/experience' },
      { label: 'Skills', icon: Code, href: '/admin/content/skills' },
      { label: 'Footer', icon: PanelBottom, href: '/admin/content/footer' },
    ]
  },
  {
    title: 'Portfolio',
    items: [
      { label: 'Projects', icon: FolderKanban, href: '/admin/projects' },
    ]
  },
  {
    title: 'Settings',
    items: [
      { label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
      { label: 'Profile Settings', icon: UserCircle, href: '/admin/profile' },
    ]
  }
]

const isActive = (href: string) => {
  if (href === '/admin') {
    return route.path === '/admin' || route.path === '/admin/' || route.path === '/admin/index'
  }
  return route.path === href || route.path.startsWith(`${href}/`)
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  navigateTo('/admin/login')
}

const handleLinkClick = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    emit('close')
  }
}
</script>

<template>
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
    <nav class="flex-1 px-3 py-4 overflow-y-auto space-y-6">
      <div v-for="group in navGroups" :key="group.title">
        <h4 class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">{{ group.title }}</h4>
        <div class="space-y-1">
          <NuxtLink
            v-for="item in group.items"
            :key="item.href"
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
            :class="isActive(item.href)
              ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'"
            :exact="item.href === '/admin'"
            :active-class="isActive(item.href) ? '!bg-violet-500/15' : ''"
            @click="handleLinkClick"
          >
            <!-- Render Lucide Icon dynamically -->
            <component 
              :is="item.icon" 
              class="w-4 h-4 shrink-0" 
              :class="isActive(item.href) ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300'"
            />
            {{ item.label }}
            
            <!-- Active indicator dot -->
            <span v-if="isActive(item.href)" class="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 transition-all duration-300" />
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- ── Logout ───────────────────────────────────────────────────────── -->
    <div class="px-3 pb-5 pt-2 border-t border-white/5">
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        @click="handleLogout"
      >
        <LogOut class="w-4 h-4 shrink-0 text-gray-500 group-hover:text-red-400 transition-colors" />
        Sign Out
      </button>
    </div>
  </aside>
</template>
