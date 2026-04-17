<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Experience Management</h1>
      
      <CMSCard title="Timeline Entries">
        <CMSListManager 
          :items="timelineEntries" 
          :default-item="defaultEntry"
          @update:items="updateEntries"
        >
          <template #item="{ item, index }">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <CMSInput 
                v-model="item.title" 
                label="Title" 
                class="md:col-span-2" 
              />
              <CMSInput 
                v-model="item.company" 
                label="Company" 
              />
              <CMSInput 
                v-model="item.period" 
                label="Period" 
              />
              <CMSTextarea 
                v-model="item.description" 
                label="Description" 
                class="md:col-span-4" 
              />
            </div>
          </template>
        </CMSListManager>
      </CMSCard>
      
      <div class="mt-6 flex justify-end">
        <SaveButton :save-action="mockSave" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminLayout from '@/layouts/admin.vue';
import CMSCard from '@/components/admin/ui/CMSCard.vue';
import CMSListManager from '@/components/admin/ui/CMSListManager.vue';
import CMSInput from '@/components/admin/ui/CMSInput.vue';
import CMSTextarea from '@/components/admin/ui/CMSTextarea.vue';
import Button from '@/components/ui/button/Button.vue';

interface TimelineEntry {
  title: string;
  company: string;
  period: string;
  description: string;
}

const timelineEntries = ref<TimelineEntry[]>([
  { 
    title: 'Frontend Developer', 
    company: 'TechCorp', 
    period: '2020-2022', 
    description: 'Developed responsive web applications' 
  },
  { 
    title: 'UI Designer', 
    company: 'DesignStudio', 
    period: '2018-2020', 
    description: 'Created user interfaces for mobile apps' 
  }
]);

const defaultEntry: TimelineEntry = {
  title: '',
  company: '',
  period: '',
  description: ''
};

function updateEntries(newEntries: TimelineEntry[]) {
  timelineEntries.value = newEntries;
}

// Mock save function for UI demonstration
const mockSave = async () => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      console.log('Experience saved:', timelineEntries.value);
      resolve();
    }, 1000);
  });
};
</script>