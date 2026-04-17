<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  hint?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-300">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :type="type || 'text'"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        class="w-full bg-[#080810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-100 
               placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 
               focus:border-violet-500/50 transition-all duration-200"
      />
    </div>
    <p v-if="hint" class="text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>
