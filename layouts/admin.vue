<script setup lang="ts">
// layouts/admin.vue
// ─────────────────────────────────────────────────────────────────────────────
// Admin shell layout: persistent dark sidebar + top header + main content area.
// Applied to all pages under /admin/* via definePageMeta({ layout: 'admin' }).
// ─────────────────────────────────────────────────────────────────────────────

// Apply the auth middleware globally to this layout's pages
definePageMeta({
  middleware: ['auth'],
})

const sidebarOpen = ref(true)

// Toggle sidebar on mobile
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-[#080810] text-gray-100 overflow-hidden font-sans">
    <!-- ── Sidebar ─────────────────────────────────────────────────────────── -->
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- ── Main content area ─────────────────────────────────────────────── -->
    <div
      class="flex-1 flex flex-col min-w-0 transition-all duration-300"
      :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'"
    >
      <!-- ── Top Header bar ─────────────────────────────────────────────── -->
      <AdminHeader @toggle-sidebar="toggleSidebar" />

      <!-- ── Scrollable page content ────────────────────────────────────── -->
      <main class="flex-1 overflow-y-auto p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- ── Mobile sidebar backdrop ──────────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/60 z-20 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
