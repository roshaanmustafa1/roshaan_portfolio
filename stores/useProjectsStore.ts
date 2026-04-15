// stores/useProjectsStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Pinia store for Projects CRUD + Supabase Storage image uploads.
// All Supabase API calls are clearly marked with ── SUPABASE API CALL ──
// ─────────────────────────────────────────────────────────────────────────────
import { defineStore } from 'pinia'

export interface Project {
  id?: string
  created_at?: string
  title: string
  description: string
  tech_stack: string[]
  demo_url: string
  github_url: string
  image_url: string
  featured: boolean
}

export const useProjectsStore = defineStore('projects', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Supabase client via @nuxtjs/supabase composable ───────────────────────
  const supabase = useSupabaseClient()

  // ── FETCH all projects ─────────────────────────────────────────────────────
  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      // ── SUPABASE API CALL: Fetch all projects, newest first ──────────────
      const { data, error: sbError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (sbError) throw sbError
      projects.value = (data as Project[]) ?? []
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // ── GET a single project by ID ─────────────────────────────────────────────
  const getProject = async (id: string): Promise<Project | null> => {
    try {
      // ── SUPABASE API CALL: Fetch a single project by UUID ───────────────
      const { data, error: sbError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (sbError) throw sbError
      return data as Project
    } catch (err: any) {
      error.value = err.message
      return null
    }
  }

  // ── ADD a new project ──────────────────────────────────────────────────────
  const addProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
    loading.value = true
    error.value = null
    try {
      // ── SUPABASE API CALL: Insert a new row into the projects table ──────
      const { data, error: sbError } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single()

      if (sbError) throw sbError
      // Prepend to local state so UI updates immediately
      projects.value.unshift(data as Project)
      return data as Project
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── UPDATE an existing project ─────────────────────────────────────────────
  const updateProject = async (id: string, updates: Partial<Project>) => {
    loading.value = true
    error.value = null
    try {
      // ── SUPABASE API CALL: Update project row by UUID ───────────────────
      const { data, error: sbError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (sbError) throw sbError
      // Reflect update in local array
      const index = projects.value.findIndex((p) => p.id === id)
      if (index !== -1) projects.value[index] = data as Project
      return data as Project
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── DELETE a project ───────────────────────────────────────────────────────
  const deleteProject = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      // ── SUPABASE API CALL: Delete project row by UUID ───────────────────
      const { error: sbError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (sbError) throw sbError
      // Remove from local state instantly
      projects.value = projects.value.filter((p) => p.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── UPLOAD project image to Supabase Storage ───────────────────────────────
  const uploadImage = async (file: File): Promise<string> => {
    // Generate a unique file path using timestamp + original filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `projects/${fileName}`

    // ── SUPABASE API CALL: Upload file to 'project-images' storage bucket ──
    // Make sure you've created a public bucket named 'project-images' in:
    // Supabase Dashboard → Storage → New Bucket → Name: 'project-images' → Public: ON
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // ── SUPABASE API CALL: Get the public URL for the uploaded file ─────────
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // ── DELETE an image from Supabase Storage ─────────────────────────────────
  const deleteImage = async (imageUrl: string) => {
    // Extract the file path from the full public URL
    const urlParts = imageUrl.split('/project-images/')
    if (urlParts.length < 2) return

    const filePath = urlParts[1]
    // ── SUPABASE API CALL: Remove file from storage bucket ─────────────────
    const { error: delError } = await supabase.storage
      .from('project-images')
      .remove([filePath])

    if (delError) throw delError
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    uploadImage,
    deleteImage,
  }
})
