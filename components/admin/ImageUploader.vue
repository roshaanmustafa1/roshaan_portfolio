<script setup lang="ts">
// components/admin/ImageUploader.vue
// ─────────────────────────────────────────────────────────────────────────────
// Drag-and-drop image uploader integrated with Supabase Storage.
// Accepts a file → uploads to Supabase → emits back the public URL.
// The actual Supabase upload is done via the useProjectsStore/useProfileStore.
//
// Props:
//   modelValue — current image URL (shown as preview)
//   uploadFn   — async function that accepts a File and returns a public URL
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  modelValue?: string
  label?: string
  uploadFn: (file: File) => Promise<string>
  accept?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Project Image',
  accept: 'image/*',
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', url: string): void
}>()

const isDragging = ref(false)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)
const previewUrl = computed(() => props.modelValue || '')

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await uploadFile(file)
}

const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) await uploadFile(file)
}

const uploadFile = async (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please select a valid image file (JPG, PNG, WebP, GIF).'
    return
  }
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'Image must be smaller than 5MB.'
    return
  }

  isUploading.value = true
  uploadError.value = null

  try {
    // ── SUPABASE API CALL: Delegated to the uploadFn prop ────────────────
    // This keeps the component generic — the store's uploadImage() or
    // uploadAvatar() function is passed in as the uploadFn prop.
    const publicUrl = await props.uploadFn(file)
    emit('update:modelValue', publicUrl)
  } catch (err: any) {
    uploadError.value = err.message ?? 'Upload failed. Please try again.'
  } finally {
    isUploading.value = false
    // Reset file input so the same file can be re-selected
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

const clearImage = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm font-medium text-gray-300">{{ label }}</p>

    <!-- Drop zone / preview area -->
    <div
      class="relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200"
      :class="[
        isDragging
          ? 'border-violet-500/60 bg-violet-500/5'
          : previewUrl
            ? 'border-white/10 bg-transparent'
            : 'border-white/10 bg-[#080810] hover:border-white/20 hover:bg-white/[0.02]'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop="handleDrop"
    >
      <!-- ── Preview mode ───────────────────────────────────────────────── -->
      <template v-if="previewUrl">
        <img
          :src="previewUrl"
          alt="Preview"
          class="w-full h-52 object-cover"
        />
        <!-- Overlay actions -->
        <div class="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            class="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
            @click="fileInputRef?.click()"
          >
            Change
          </button>
          <button
            type="button"
            class="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors backdrop-blur-sm"
            @click="clearImage"
          >
            Remove
          </button>
        </div>
      </template>

      <!-- ── Upload prompt ─────────────────────────────────────────────── -->
      <template v-else>
        <div class="py-10 flex flex-col items-center gap-3 cursor-pointer" @click="fileInputRef?.click()">
          <!-- Upload icon -->
          <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <svg v-if="!isUploading" class="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <!-- Loading spinner -->
            <svg v-else class="w-6 h-6 text-violet-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-300 font-medium">
              {{ isUploading ? 'Uploading to Supabase Storage...' : 'Drop image here or click to browse' }}
            </p>
            <p class="text-xs text-gray-600 mt-1">PNG, JPG, WebP · Max 5MB</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Error message -->
    <Transition name="fade">
      <p v-if="uploadError" class="text-xs text-red-400 flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        {{ uploadError }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
