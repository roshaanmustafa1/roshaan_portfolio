<script setup lang="ts">
// components/admin/TechTagInput.vue
// ─────────────────────────────────────────────────────────────────────────────
// Multi-tag input for tech stack selection.
// Works with v-model — emits an array of strings.
// ─────────────────────────────────────────────────────────────────────────────
const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: string[]): void }>()

const inputVal = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

// Common tech suggestions for autocomplete feel (press Enter or comma to add)
const suggestions = [
  'Vue.js', 'React', 'Nuxt.js', 'Next.js', 'TypeScript', 'JavaScript',
  'Node.js', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'MongoDB',
  'Docker', 'Python', 'FastAPI', 'GraphQL', 'REST API', 'GSAP',
]

const filteredSuggestions = computed(() => {
  if (!inputVal.value) return []
  const lower = inputVal.value.toLowerCase()
  return suggestions
    .filter(s => s.toLowerCase().includes(lower) && !props.modelValue.includes(s))
    .slice(0, 5)
})

const showSuggestions = ref(false)

const addTag = (tag: string) => {
  const cleaned = tag.trim()
  if (cleaned && !props.modelValue.includes(cleaned)) {
    emit('update:modelValue', [...props.modelValue, cleaned])
  }
  inputVal.value = ''
  showSuggestions.value = false
  inputRef.value?.focus()
}

const removeTag = (index: number) => {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag(inputVal.value)
  } else if (e.key === 'Backspace' && !inputVal.value && props.modelValue.length) {
    removeTag(props.modelValue.length - 1)
  }
}

const onInput = () => {
  showSuggestions.value = !!inputVal.value
}

const onBlur = () => {
  // Small delay so suggestion click registers first
  setTimeout(() => {
    showSuggestions.value = false
    if (inputVal.value) addTag(inputVal.value)
  }, 150)
}
</script>

<template>
  <div class="relative">
    <!-- Tag container + input field -->
    <div
      class="flex flex-wrap gap-2 p-2.5 min-h-[44px] bg-[#080810] border border-white/10 rounded-lg
             focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all cursor-text"
      @click="inputRef?.focus()"
    >
      <!-- Rendered tags -->
      <span
        v-for="(tag, i) in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-500/15 text-violet-300
               border border-violet-500/25 rounded-md text-xs font-medium"
      >
        {{ tag }}
        <button
          type="button"
          class="text-violet-400/60 hover:text-violet-300 ml-0.5 transition-colors"
          @click.stop="removeTag(i)"
        >
          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </span>

      <!-- Text input -->
      <input
        ref="inputRef"
        v-model="inputVal"
        type="text"
        placeholder="Add tech (Enter or comma to add)..."
        class="flex-1 min-w-[150px] bg-transparent text-sm text-gray-200 placeholder:text-gray-600 outline-none border-none"
        @keydown="onKeydown"
        @input="onInput"
        @blur="onBlur"
        @focus="showSuggestions = !!inputVal"
      />
    </div>

    <!-- Autocomplete dropdown -->
    <Transition name="dropdown">
      <ul
        v-if="showSuggestions && filteredSuggestions.length"
        class="absolute z-20 mt-1 w-full bg-[#13131E] border border-white/10 rounded-lg
               shadow-xl shadow-black/50 overflow-hidden"
      >
        <li
          v-for="sug in filteredSuggestions"
          :key="sug"
          class="px-3 py-2 text-sm text-gray-300 hover:bg-violet-500/10 hover:text-violet-300 cursor-pointer transition-colors"
          @mousedown.prevent="addTag(sug)"
        >
          {{ sug }}
        </li>
      </ul>
    </Transition>

    <p class="mt-1.5 text-xs text-gray-600">Press Enter or comma (,) to add a tag. Backspace to remove last.</p>
  </div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
