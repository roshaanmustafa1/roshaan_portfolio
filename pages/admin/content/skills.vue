<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Skills Management</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Skill Categories -->
        <CMSCard title="Skill Categories">
          <CMSListManager 
            :items="skillCategories" 
            :default-item="defaultCategory"
            @update:items="updateCategories"
          >
            <template #item="{ item, index }">
              <CMSInput 
                v-model="item.name" 
                label="Category Name" 
                class="w-full" 
              />
            </template>
          </CMSListManager>
        </CMSCard>
        
        <!-- Tags -->
        <CMSCard title="Tags">
          <CMSListManager 
            :items="tags" 
            :default-item="defaultTag"
            @update:items="updateTags"
          >
            <template #item="{ item, index }">
              <div class="flex items-center gap-3 w-full">
                <CMSInput 
                  v-model="item.name" 
                  label="Tag Name" 
                  class="flex-1" 
                />
                <div class="w-8 h-8 rounded-full" :style="{ backgroundColor: item.color }"></div>
              </div>
            </template>
          </CMSListManager>
        </CMSCard>
      </div>
      
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
import Button from '@/components/ui/button/Button.vue';

interface SkillCategory {
  name: string;
}

interface Tag {
  name: string;
  color: string;
}

const skillCategories = ref<SkillCategory[]>([
  { name: 'Frontend' },
  { name: 'Backend' },
  { name: 'Design' }
]);

const tags = ref<Tag[]>([
  { name: 'Vue.js', color: '#41b883' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Tailwind CSS', color: '#38bdf8' }
]);

const defaultCategory: SkillCategory = {
  name: ''
};

const defaultTag: Tag = {
  name: '',
  color: '#000000'
};

function updateCategories(newCategories: SkillCategory[]) {
  skillCategories.value = newCategories;
}

function updateTags(newTags: Tag[]) {
  tags.value = newTags;
}

// Mock save function for UI demonstration
const mockSave = async () => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      console.log('Skills saved:', {
        categories: skillCategories.value,
        tags: tags.value
      });
      resolve();
    }, 1000);
  });
};
</script>