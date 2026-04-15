// stores/useProfileStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Pinia store for Profile / Hero section data.
// All Supabase API calls are clearly marked with ── SUPABASE API CALL ──
// ─────────────────────────────────────────────────────────────────────────────
import { defineStore } from 'pinia'

export interface Profile {
  id?: number
  full_name: string
  title: string
  short_bio: string
  long_bio: string
  github_url: string
  linkedin_url: string
  twitter_url: string
  website_url: string
  avatar_url: string
  updated_at?: string
}

const defaultProfile: Profile = {
  full_name: '',
  title: '',
  short_bio: '',
  long_bio: '',
  github_url: '',
  linkedin_url: '',
  twitter_url: '',
  website_url: '',
  avatar_url: '',
}

export const useProfileStore = defineStore('profile', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const profile = ref<Profile>({ ...defaultProfile })
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const savedSuccess = ref(false)

  // ── Supabase client ────────────────────────────────────────────────────────
  const supabase = useSupabaseClient()

  // ── FETCH profile (single row, id = 1) ────────────────────────────────────
  const fetchProfile = async () => {
    loading.value = true
    error.value = null
    try {
      // ── SUPABASE API CALL: Fetch the single profile row (id = 1) ────────
      const { data, error: sbError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .single()

      if (sbError && sbError.code !== 'PGRST116') {
        // PGRST116 = "no rows returned" — OK for first-time setup
        throw sbError
      }
      if (data) {
        profile.value = data as Profile
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // ── SAVE (upsert) profile ──────────────────────────────────────────────────
  const saveProfile = async (updates: Partial<Profile>) => {
    saving.value = true
    error.value = null
    savedSuccess.value = false
    try {
      const payload = {
        id: 1, // Always use id = 1 for the single profile row
        ...profile.value,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      // ── SUPABASE API CALL: Upsert (insert or update) the profile row ────
      const { data, error: sbError } = await supabase
        .from('profile')
        .upsert(payload)
        .select()
        .single()

      if (sbError) throw sbError
      profile.value = data as Profile
      savedSuccess.value = true

      // Auto-clear success flag after 3s
      setTimeout(() => { savedSuccess.value = false }, 3000)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  // ── UPLOAD avatar image ────────────────────────────────────────────────────
  const uploadAvatar = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // ── SUPABASE API CALL: Upload avatar to 'project-images' bucket ─────────
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true })

    if (uploadError) throw uploadError

    // ── SUPABASE API CALL: Get public URL for the uploaded avatar ───────────
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  return {
    profile,
    loading,
    saving,
    error,
    savedSuccess,
    fetchProfile,
    saveProfile,
    uploadAvatar,
  }
})
