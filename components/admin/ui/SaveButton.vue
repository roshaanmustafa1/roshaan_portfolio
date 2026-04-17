<template>
  <Button 
    :class="{
      'bg-green-500 hover:bg-green-600': state === 'success',
      'bg-gray-500 cursor-not-allowed': state === 'loading'
    }"
    :disabled="state === 'loading'"
    @click="handleClick"
  >
    <span v-if="state === 'idle'">Save Changes</span>
    <span v-else-if="state === 'loading'">Saving...</span>
    <span v-else-if="state === 'success'">Saved!</span>
    
    <svg 
      v-if="state === 'loading'" 
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/ui/button/Button.vue';

type SaveState = 'idle' | 'loading' | 'success';

const props = defineProps<{
  saveAction: () => Promise<void> | void
}>();

const state = ref<SaveState>('idle');

async function handleClick() {
  state.value = 'loading';
  
  try {
    await props.saveAction();
    state.value = 'success';
    
    // Reset to idle after 2 seconds
    setTimeout(() => {
      state.value = 'idle';
    }, 2000);
  } catch (error) {
    state.value = 'idle';
    console.error('Save failed:', error);
  }
}
</script>