<template>
  <div class="space-y-4">
    <div v-for="(item, index) in items" :key="index" class="flex items-center gap-3 p-3 bg-gray-100 rounded-md">
      <!-- Drag handle for reordering -->
      <button class="cursor-move text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </button>
      
      <!-- Item content slot -->
      <div class="flex-1">
        <slot name="item" :item="item" :index="index"></slot>
      </div>
      
      <!-- Delete button -->
      <button @click="removeItem(index)" class="text-red-500 hover:text-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <!-- Add new item button -->
    <button 
      @click="addItem" 
      class="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
      </svg>
      Add New
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends object">
import { ref } from 'vue';

const props = defineProps<{
  items: T[]
  defaultItem: T
}>();

const emit = defineEmits<{
  (e: 'update:items', items: T[]): void
}>();

function addItem() {
  const newItems = [...props.items, { ...props.defaultItem }];
  emit('update:items', newItems);
}

function removeItem(index: number) {
  const newItems = [...props.items];
  newItems.splice(index, 1);
  emit('update:items', newItems);
}

// Reordering functionality will be implemented with drag-and-drop later
</script>
