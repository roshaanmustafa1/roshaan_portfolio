<script setup lang="ts">
// components/admin/MessageRow.vue
// ─────────────────────────────────────────────────────────────────────────────
// Table row component for a single contact message.
// ─────────────────────────────────────────────────────────────────────────────
interface Message {
  id: string
  created_at: string
  name: string
  email: string
  subject?: string
  message: string
  is_read: boolean
}

defineProps<{ message: Message }>()
defineEmits<{
  (e: 'markRead', id: string): void
  (e: 'delete', id: string): void
}>()

const formattedDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
      :class="!message.is_read ? 'bg-violet-500/[0.04]' : ''">
    <!-- Unread indicator -->
    <td class="pl-4 pr-2 py-3.5 w-3">
      <div
        class="w-2 h-2 rounded-full transition-colors"
        :class="message.is_read ? 'bg-transparent' : 'bg-violet-500'"
      />
    </td>

    <!-- Sender -->
    <td class="px-3 py-3.5">
      <div>
        <p class="text-sm font-medium" :class="message.is_read ? 'text-gray-300' : 'text-white'">
          {{ message.name }}
        </p>
        <p class="text-xs text-gray-500">{{ message.email }}</p>
      </div>
    </td>

    <!-- Subject / message preview -->
    <td class="px-3 py-3.5 max-w-xs">
      <p class="text-sm font-medium text-gray-300 line-clamp-1">{{ message.subject || '(No subject)' }}</p>
      <p class="text-xs text-gray-500 line-clamp-1 mt-0.5">{{ message.message }}</p>
    </td>

    <!-- Date -->
    <td class="px-3 py-3.5 text-xs text-gray-500 whitespace-nowrap">
      {{ formattedDate(message.created_at) }}
    </td>

    <!-- Actions -->
    <td class="px-3 py-3.5">
      <div class="flex items-center gap-2">
        <button
          v-if="!message.is_read"
          class="p-1.5 rounded-md text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
          title="Mark as read"
          @click="$emit('markRead', message.id)"
        >
          <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </button>
        <button
          class="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Delete message"
          @click="$emit('delete', message.id)"
        >
          <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>
