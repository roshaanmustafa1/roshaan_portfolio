<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: any // Lucide component
}>()
</script>

<template>
  <div class="bg-[#0D0D14] border border-white/5 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
    <div class="px-6 py-5 border-b border-white/5 flex items-center gap-3">
      <div v-if="icon" class="p-2 bg-white/5 rounded-lg text-gray-400">
        <component :is="icon" class="w-5 h-5" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
        <p v-if="description" class="text-sm text-gray-400 mt-0.5">{{ description }}</p>
      </div>
    </div>
    
    <div class="p-6">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3">
      <slot name="footer" />
    </div>
  </div>
</template>
