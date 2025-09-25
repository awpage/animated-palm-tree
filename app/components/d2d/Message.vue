<script lang="ts" setup>
import type { ServerMessage } from '~/types/sse';
import notify from '~/components/notify'

const emit = defineEmits(["open"])
const { message, isOpened = false } = defineProps<{
  message: ServerMessage,
  isOpened: boolean
}>()

async function copyToClipboard() {
  try {
    await window.navigator.clipboard.writeText(message.content)
    notify.show({ type: "success", message: "Code copied to your clipboard" })
  } catch (error) {
    console.error(error)
    notify.show({ type: 'error', message: "An error occurred while copying" })
  }
}
</script>

<template>
  <section class="px-5 bg-gray-100 mb-2 !overflow-hidden" :class="{ 'border border-gray-400': isOpened }">
    <div class="flex justify-between items-center py-3 text-sm border-b border-gray-200 text-gray-600">
      {{ formatDate(new Date(message.createdAt)) }}

      <button @click="copyToClipboard()" class="flex items-center uppercase cursor-pointer">
        <svg class="w-5" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path
            d="M341.33,85.33V405.33H85.33V85.33H341.33ZM298.67,128H128V362.67H298.67V128ZM234.67,0V42.67H42.67V298.67H0V0H234.67Z" />
        </svg>
        copy
      </button>
    </div>
    <div class="py-3 cursor-pointer" :class="{ 'font-sans whitespace-pre-wrap': isOpened }" @click="emit('open')">
      {{ isOpened ? message.content : message.content.length > 35 ? `${getFirstChars(message.content, 35)} ...` :
      message.content }}
    </div>
    <div class="text-xs pb-3 text-gray-500">
      {{ message.senderId?.toLocaleUpperCase() }}
    </div>
  </section>
</template>