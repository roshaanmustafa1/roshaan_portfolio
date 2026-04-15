<script setup lang="ts">
// pages/admin/projects/[id].vue
// ─────────────────────────────────────────────────────────────────────────────
// Add / Edit project page.
// Route param [id] === 'new' → add mode
// Route param [id] === <uuid> → edit mode
//
// Supabase operations delegated to useProjectsStore.
// ─────────────────────────────────────────────────────────────────────────────
definePageMeta({ layout: 'admin', middleware: ['auth'] })

const route = useRoute()
const store = useProjectsStore()

const projectId = computed(() => route.params.id as string)
const isNew = computed(() => projectId.value === 'new')
const mode = computed(() => isNew.value ? 'add' : 'edit')

// Project data to pre-fill form in edit mode
const initialData = ref<any>({})
const pageLoading = ref(false)
const successMessage = ref('')

// ── Fetch existing project in edit mode ───────────────────────────────────
onMounted(async () => {
  if (!isNew.value) {
    pageLoading.value = true
    // ── SUPABASE API CALL: Get project by UUID to prefill form ──────────
    const project = await store.getProject(projectId.value)
    if (project) {
      initialData.value = { ...project }
    }
    pageLoading.value = false
  }
})

// ── Form submit handler ───────────────────────────────────────────────────
const handleSubmit = async (formData: any) => {
  try {
    if (isNew.value) {
      // ── SUPABASE API CALL: Insert new project row ────────────────────
      await store.addProject(formData)
      successMessage.value = 'Project added successfully!'
    } else {
      // ── SUPABASE API CALL: Update existing project row ───────────────
      await store.updateProject(projectId.value, formData)
      successMessage.value = 'Project updated successfully!'
    }

    // Show success then redirect to projects list
    setTimeout(() => navigateTo('/admin/projects'), 1500)
  } catch (err: any) {
    // Error is already stored in store.error
  }
}

const handleCancel = () => navigateTo('/admin/projects')
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- ── Breadcrumb ──────────────────────────────────────────────────────── -->
    <nav class="flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/admin/projects" class="hover:text-gray-300 transition-colors">Projects</NuxtLink>
      <span class="text-gray-700">/</span>
      <span class="text-gray-300">{{ isNew ? 'New Project' : 'Edit Project' }}</span>
    </nav>

    <!-- ── Page header ────────────────────────────────────────────────────── -->
    <div>
      <h2 class="text-xl font-bold text-white">{{ isNew ? 'Add New Project' : 'Edit Project' }}</h2>
      <p class="text-gray-500 text-sm mt-1">
        {{ isNew
            ? 'Fill in the details below to add a new project to your portfolio.'
            : 'Update the project details below. Changes will reflect immediately.' }}
      </p>
    </div>

    <!-- ── Success banner ─────────────────────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="successMessage" class="flex items-center gap-2.5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <svg class="w-4 h-4 text-emerald-400 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
        <p class="text-emerald-400 text-sm font-medium">{{ successMessage }}</p>
      </div>
    </Transition>

    <!-- ── Error banner ───────────────────────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="store.error" class="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        <svg class="w-4 h-4 text-red-400 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-400 text-sm">{{ store.error }}</p>
      </div>
    </Transition>

    <!-- ── Form card ──────────────────────────────────────────────────────── -->
    <div class="bg-[#0D0D14] border border-white/5 rounded-xl p-6">
      <!-- Loading skeleton for edit mode -->
      <div v-if="pageLoading" class="space-y-5">
        <div v-for="i in 4" :key="i" class="h-12 bg-white/3 rounded-lg animate-pulse" />
      </div>

      <!-- ── Project form component ─────────────────────────────────────── -->
      <!-- All CRUD logic and Supabase calls happen inside ProjectForm
           and are delegated to the useProjectsStore. -->
      <AdminProjectForm
        v-else
        :initial-data="initialData"
        :mode="mode"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <!-- ── Helpful info box ───────────────────────────────────────────────── -->
    <div class="bg-violet-500/5 border border-violet-500/10 rounded-xl p-4">
      <p class="text-violet-400 text-xs font-semibold mb-2 uppercase tracking-wider">💡 Supabase Integration</p>
      <p class="text-gray-500 text-xs leading-relaxed">
        Project data is stored in the <code class="text-violet-300 bg-violet-500/10 px-1 rounded">projects</code> table
        and images are uploaded to the <code class="text-violet-300 bg-violet-500/10 px-1 rounded">project-images</code>
        Supabase Storage bucket. Make sure the bucket exists and is set to public before uploading.
      </p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
