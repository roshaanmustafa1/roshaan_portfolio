<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Footer Management</h1>
      
      <CMSCard title="Social Links">
        <CMSListManager 
          :items="socialLinks" 
          :default-item="defaultSocialLink"
          @update:items="updateSocialLinks"
        >
          <template #item="{ item, index }">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <CMSInput 
                v-model="item.platform" 
                label="Platform" 
                placeholder="e.g., Twitter, LinkedIn"
              />
              <CMSInput 
                v-model="item.url" 
                label="URL" 
                placeholder="https://..."
                class="md:col-span-2"
              />
            </div>
          </template>
        </CMSListManager>
      </CMSCard>
      
      <CMSCard title="Copyright" class="mt-6">
        <CMSInput 
          v-model="copyrightText" 
          label="Copyright Text" 
          placeholder="© 2023 Your Name"
        />
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
import Button from '@/components/ui/button/Button.vue';

interface SocialLink {
  platform: string;
  url: string;
}

const socialLinks = ref<SocialLink[]>([
  { platform: 'Twitter', url: 'https://twitter.com/example' },
  { platform: 'GitHub', url: 'https://github.com/example' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/example' }
]);

const copyrightText = ref('© 2023 Roshaan Portfolio. All rights reserved.');

const defaultSocialLink: SocialLink = {
  platform: '',
  url: ''
};

const updateSocialLinks = (newLinks: SocialLink[]) => {
  socialLinks.value = newLinks;
};

// Mock save function for UI demonstration
const mockSave = async () => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      console.log('Footer saved:', {
        socialLinks: socialLinks.value,
        copyright: copyrightText.value
      });
      resolve();
    }, 1000);
  });
};
</script>