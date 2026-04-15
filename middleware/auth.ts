// middleware/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Route Guard: Protects all /admin/* routes except /admin/login.
// Uses @nuxtjs/supabase's useSupabaseUser() composable which reactively
// reflects the current Supabase Auth session state (SSR + client aware).
// ─────────────────────────────────────────────────────────────────────────────
export default defineNuxtRouteMiddleware((to) => {
  // useSupabaseUser() returns a ref<User | null> from the Supabase session
  const user = useSupabaseUser()

  // Allow access to the login page without authentication
  if (to.path === '/admin/login') {
    // If user is already logged in, redirect away from login page
    if (user.value) {
      return navigateTo('/admin')
    }
    return
  }

  // For all other /admin/* routes, require authentication
  if (to.path.startsWith('/admin')) {
    if (!user.value) {
      // No active session → redirect to login
      return navigateTo('/admin/login')
    }
  }
})
