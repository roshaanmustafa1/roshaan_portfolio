<script setup lang="ts">
// pages/admin/messages.vue
// ─────────────────────────────────────────────────────────────────────────────
// Contact messages inbox.
// All messages are stored in the `messages` table in Supabase.
// ─────────────────────────────────────────────────────────────────────────────
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface Message {
  id: string
  created_at: string
  name: string
  email: string
  subject?: string
  message: string
  is_read: boolean
}

// ── SUPABASE: client via @nuxtjs/supabase ─────────────────────────────────
const supabase = useSupabaseClient()

const messages = ref<Message[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const filterMode = ref<'all' | 'unread'>('all')
const showDeleteModal = ref(false)
const messageToDelete = ref<string | null>(null)
const selectedMessage = ref<Message | null>(null)

// ── SUPABASE API CALL: Fetch all messages, newest first ───────────────────
const fetchMessages = async () => {
  loading.value = true
  error.value = null
  try {
    const { data, error: sbError } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (sbError) throw sbError
    console.log('Fetched messages:', data)
    messages.value = (data as Message[]) ?? []
  } catch (err: any) {
    console.error('Error fetching messages:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchMessages)

const filteredMessages = computed(() => {
  if (filterMode.value === 'unread') return messages.value.filter(m => !m.is_read)
  return messages.value
})

const unreadCount = computed(() => messages.value.filter(m => !m.is_read).length)

// ── SUPABASE API CALL: Mark message as read ────────────────────────────────
const markAsRead = async (id: string) => {
  try {
    const { error: sbError } = await supabase
      .from('messages')
      .update({ is_read: true } as never)
      .eq('id', id)

    if (sbError) throw sbError
    const msg = messages.value.find(m => m.id === id)
    if (msg) msg.is_read = true
  } catch (err: any) {
    error.value = err.message
  }
}

// ── SUPABASE API CALL: Delete a message ────────────────────────────────────
const confirmDeleteMsg = (id: string) => {
  messageToDelete.value = id
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!messageToDelete.value) return
  try {
    const { error: sbError } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageToDelete.value as string)

    if (sbError) throw sbError
    messages.value = messages.value.filter(m => m.id !== messageToDelete.value)
    if (selectedMessage.value?.id === messageToDelete.value) selectedMessage.value = null
  } catch (err: any) {
    error.value = err.message
  }
  showDeleteModal.value = false
  messageToDelete.value = null
}

// Open message detail and auto-mark as read
const openMessage = async (message: Message) => {
  selectedMessage.value = message
  if (!message.is_read) {
    await markAsRead(message.id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- ── Stats row ──────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-4">
      <div class="flex-1 flex items-center gap-4">
        <div class="bg-[#0D0D14] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
          <span class="text-2xl font-bold text-white">{{ messages.length }}</span>
          <span class="text-gray-500 text-sm">Total</span>
        </div>
        <div class="bg-[#0D0D14] border border-violet-500/15 rounded-xl px-4 py-3 flex items-center gap-3">
          <span class="text-2xl font-bold text-violet-400">{{ unreadCount }}</span>
          <span class="text-gray-500 text-sm">Unread</span>
        </div>
      </div>

      <!-- Filter toggle -->
      <div class="flex items-center bg-[#0D0D14] border border-white/8 rounded-lg p-0.5">
        <button
          class="px-3 py-1.5 rounded-md text-sm transition-colors"
          :class="filterMode === 'all' ? 'bg-white/10 text-white font-medium' : 'text-gray-500 hover:text-gray-300'"
          @click="filterMode = 'all'"
        >
          All
        </button>
        <button
          class="px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5"
          :class="filterMode === 'unread' ? 'bg-white/10 text-white font-medium' : 'text-gray-500 hover:text-gray-300'"
          @click="filterMode = 'unread'"
        >
          Unread
          <span v-if="unreadCount" class="w-4 h-4 text-[10px] bg-violet-500 text-white rounded-full flex items-center justify-center">{{ unreadCount }}</span>
        </button>
      </div>

      <!-- Refresh -->
      <button
        class="p-2 bg-[#0D0D14] border border-white/5 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
        :class="loading ? 'animate-spin' : ''"
        title="Refresh"
        @click="fetchMessages"
      >
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
      </button>
    </div>

    <!-- ── Two-column layout: list + detail ───────────────────────────────── -->
    <div class="flex gap-4 h-[calc(100vh-280px)] min-h-[400px]">
      <!-- Left: messages table -->
      <div class="flex-1 bg-[#0D0D14] border border-white/5 rounded-xl overflow-hidden flex flex-col">
        <!-- Loading -->
        <div v-if="loading" class="flex-1 p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="h-14 bg-white/3 rounded-lg animate-pulse" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="flex-1 flex items-center justify-center text-red-400 text-sm">{{ error }}</div>

        <!-- Empty -->
        <div v-else-if="!filteredMessages.length" class="flex-1 flex flex-col items-center justify-center text-center py-12">
          <svg class="w-10 h-10 text-gray-700 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
          <p class="text-gray-500 text-sm">{{ filterMode === 'unread' ? 'No unread messages' : 'No messages yet' }}</p>
        </div>

        <!-- Messages table -->
        <div v-else class="overflow-y-auto flex-1">
          <table class="w-full">
            <tbody>
              <AdminMessageRow
                v-for="msg in filteredMessages"
                :key="msg.id"
                :message="msg"
                class="cursor-pointer"
                :class="selectedMessage?.id === msg.id ? 'bg-violet-500/5' : ''"
                @click="openMessage(msg)"
                @mark-read="markAsRead($event)"
                @delete="confirmDeleteMsg($event)"
              />
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: message detail panel -->
      <Transition name="panel">
        <div
          v-if="selectedMessage"
          class="w-96 bg-[#0D0D14] border border-white/5 rounded-xl overflow-hidden flex flex-col hidden lg:flex"
        >
          <!-- Header -->
          <div class="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 class="text-white font-semibold text-sm">Message Detail</h3>
            <button class="text-gray-600 hover:text-gray-400 transition-colors" @click="selectedMessage = null">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            <!-- Sender info -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                <span class="text-white font-bold text-sm">{{ selectedMessage.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <p class="text-white font-semibold text-sm">{{ selectedMessage.name }}</p>
                <a :href="`mailto:${selectedMessage.email}`" class="text-violet-400 text-xs hover:text-violet-300 transition-colors">{{ selectedMessage.email }}</a>
              </div>
            </div>

            <div class="border-t border-white/5 pt-4">
              <p class="text-xs text-gray-600 mb-1">
                {{ new Date(selectedMessage.created_at).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
              </p>
              <p class="text-white font-medium text-sm mb-3">{{ selectedMessage.subject || '(No subject)' }}</p>
              <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{{ selectedMessage.message }}</p>
            </div>
          </div>

          <!-- Reply / delete footer -->
          <div class="px-5 py-4 border-t border-white/5 flex gap-2">
            <a
              :href="`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`"
              class="flex-1 flex items-center justify-center gap-2 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
              Reply
            </a>
            <button
              class="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors"
              @click="confirmDeleteMsg(selectedMessage.id)"
            >
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ── Delete confirmation modal ─────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showDeleteModal = false">
          <div class="bg-[#0D0D14] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 class="text-white font-semibold mb-2">Delete Message?</h3>
            <p class="text-gray-400 text-sm mb-6">This message will be permanently deleted from Supabase.</p>
            <div class="flex gap-3">
              <button class="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-colors" @click="showDeleteModal = false">Cancel</button>
              <button class="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors" @click="executeDelete">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.panel-enter-active, .panel-leave-active { transition: all 0.25s ease; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: translateX(20px); }
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
