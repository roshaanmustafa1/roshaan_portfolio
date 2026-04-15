<script setup lang="ts">
// components/admin/StatCard.vue
// ─────────────────────────────────────────────────────────────────────────────
// Reusable dashboard stat card with icon, value, label, and trend indicator.
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  label: string
  value: string | number
  icon: 'projects' | 'profile' | 'messages' | 'updated'
  trend?: string
  trendUp?: boolean
  color?: 'violet' | 'blue' | 'emerald' | 'amber'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'violet',
  trendUp: true,
})

const colorMap = {
  violet: {
    icon: 'bg-violet-500/15 text-violet-400',
    trend: 'text-violet-400',
    glow: 'shadow-violet-500/10',
  },
  blue: {
    icon: 'bg-blue-500/15 text-blue-400',
    trend: 'text-blue-400',
    glow: 'shadow-blue-500/10',
  },
  emerald: {
    icon: 'bg-emerald-500/15 text-emerald-400',
    trend: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-400',
    trend: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
}
const c = computed(() => colorMap[props.color])
</script>

<template>
  <div
    class="bg-[#0D0D14] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors shadow-xl"
    :class="c.glow"
  >
    <div class="flex items-start justify-between">
      <!-- Icon -->
      <div class="p-2.5 rounded-lg" :class="c.icon">
        <!-- Projects icon -->
        <svg v-if="icon === 'projects'" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
        <!-- Profile icon -->
        <svg v-if="icon === 'profile'" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <!-- Messages icon -->
        <svg v-if="icon === 'messages'" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        <!-- Updated/clock icon -->
        <svg v-if="icon === 'updated'" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Trend badge -->
      <span v-if="trend" class="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5" :class="c.trend">
        {{ trend }}
      </span>
    </div>

    <!-- Value + Label -->
    <div class="mt-4">
      <p class="text-2xl font-bold text-white">{{ value }}</p>
      <p class="text-gray-500 text-sm mt-0.5">{{ label }}</p>
    </div>
  </div>
</template>
