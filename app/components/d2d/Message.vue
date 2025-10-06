<script lang="ts" setup>
import type { ServerMessage } from '~/types/sse';
import notify from '~/components/notify'
import useClientStorage from '~/composables/storage';

const emit = defineEmits(["open", "reply"])
const { message, isOpened = false } = defineProps<{
  message: ServerMessage,
  isOpened: boolean
}>()

const store = useClientStorage()

const deviceId = computed(() => store?.deviceID.value)

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
  <section class="px-5 bg-gray-100 mb-2 !overflow-hidden"
    :class="{ 'border border-gray-400': isOpened, '!bg-gray-200/70': message.senderId === deviceId }">
    <div class="flex justify-between items-center py-3 text-sm border-b border-gray-200 text-gray-600">
      <span>
        {{ message.senderId === deviceId ? "To" : "From" }}:
        <span class="text-black">
          {{ message.senderId === deviceId ? message.recipientId?.toLocaleUpperCase() :
            message.senderId?.toLocaleUpperCase() }}
        </span>
      </span>

      <div class="flex gap-5 items-center">
        <button @click="emit('reply', message.senderId)"
          class="flex items-center uppercase cursor-pointer hover:bg-gray-200">
          <svg class="w-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_iconCarrier">
              <path d="M10 11h6v7h2v-8a1 1 0 0 0-1-1h-7V6l-5 4 5 4v-3z"></path>
            </g>
          </svg>
          reply
        </button>

        <button @click="copyToClipboard()" class="flex items-center uppercase cursor-pointer hover:bg-gray-200 p-1">
          <svg class="w-5" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path
              d="M341.33,85.33V405.33H85.33V85.33H341.33ZM298.67,128H128V362.67H298.67V128ZM234.67,0V42.67H42.67V298.67H0V0H234.67Z" />
          </svg>
          copy
        </button>
      </div>
    </div>
    <div class="py-3 cursor-pointer" :class="{ 'font-sans whitespace-pre-wrap': isOpened }" @click="emit('open')">
      {{ isOpened ? message.content : message.content.length > 35 ? `${getFirstChars(message.content, 35)} ` :
        message.content }}
      <p class="text-blue-500 inline text-sm">{{ isOpened ? "" : message.content.length > 35 ? "read more..." : "" }}
      </p>
    </div>
    <div class="text-xs pb-3 text-gray-500">
      {{ formatDate(new Date(message.createdAt)) }}
    </div>
  </section>
</template>