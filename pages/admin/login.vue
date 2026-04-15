<script setup lang="ts">
// pages/admin/login.vue
// ─────────────────────────────────────────────────────────────────────────────
// Public login page — accessible without authentication.
// Uses Supabase Auth's signInWithPassword() method.
// On success, redirects to /admin dashboard.
// ─────────────────────────────────────────────────────────────────────────────

// Use the 'default' layout for login (no sidebar needed)
definePageMeta({ layout: 'default' })

// ── SUPABASE: client and reactive user from @nuxtjs/supabase ─────────────
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// If already logged in, skip login page
watchEffect(() => {
  if (user.value) {
    navigateTo('/admin')
  }
})

// ── Form state ────────────────────────────────────────────────────────────────
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const showPassword = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }

  loading.value = true
  error.value = null

  try {
    // ── SUPABASE API CALL: Sign in with email/password ──────────────────
    // This creates a session that is stored in cookies/localStorage.
    // The auth middleware checks this session to protect /admin/* routes.
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) throw authError

    // Successful login — navigate to admin dashboard
    await navigateTo('/admin')
  } catch (err: any) {
    // Map common Supabase auth errors to user-friendly messages
    if (err.message?.includes('Invalid login credentials')) {
      error.value = 'Incorrect email or password. Please try again.'
    } else if (err.message?.includes('Email not confirmed')) {
      error.value = 'Please verify your email address before logging in.'
    } else {
      error.value = err.message ?? 'An error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Full-screen dark background -->
  <div class="min-h-screen bg-[#080810] flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background glow effect -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-3xl" />
      <div class="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-600/6 rounded-full blur-3xl" />
    </div>

    <!-- Login card -->
    <div class="relative w-full max-w-[400px]">
      <!-- Card -->
      <div class="bg-[#0D0D14] border border-white/8 rounded-2xl p-8 shadow-2xl shadow-black/50">
        <!-- Brand header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30 mb-4">
            <span class="text-white text-lg font-bold">R</span>
          </div>
          <h1 class="text-xl font-bold text-white">Admin Portal</h1>
          <p class="text-gray-500 text-sm mt-1">Sign in to manage your portfolio</p>
        </div>

        <!-- Error alert -->
        <Transition name="fade">
          <div
            v-if="error"
            class="mb-5 flex items-start gap-2.5 px-3.5 py-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-red-400">{{ error }}</p>
          </div>
        </Transition>

        <!-- Login form -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- Email -->
          <div>
            <label for="admin-email" class="block text-sm font-medium text-gray-400 mb-1.5">
              Email Address
            </label>
            <input
              id="admin-email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="admin@example.com"
              required
              class="w-full px-4 py-2.5 bg-[#080810] border border-white/10 rounded-lg text-sm text-gray-200
                     placeholder:text-gray-700 outline-none transition-all duration-200
                     focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="admin-password" class="block text-sm font-medium text-gray-400 mb-1.5">
              Password
            </label>
            <div class="relative">
              <input
                id="admin-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••••••"
                required
                class="w-full px-4 py-2.5 pr-10 bg-[#080810] border border-white/10 rounded-lg text-sm text-gray-200
                       placeholder:text-gray-700 outline-none transition-all duration-200
                       focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
              <!-- Show/hide password toggle -->
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              </button>
            </div>
          </div>

          <!-- Submit button -->
          <button
            id="admin-login-btn"
            type="submit"
            class="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold
                   rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/25 mt-2
                   flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Back to portfolio link -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to Portfolio
          </NuxtLink>
        </div>
      </div>

      <!-- Subtle hint for development -->
      <p class="text-center text-gray-700 text-xs mt-4">
        Use your Supabase Auth credentials to sign in
      </p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
