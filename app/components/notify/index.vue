<script lang="ts" setup>
const { type, message } = defineProps<{ type: "error" | "success", message: string }>()
const emit = defineEmits(["close"])

const isVisible = ref(true)

function dismiss() {
  isVisible.value = false
  emit("close")
}

onMounted(() => {
  setTimeout(() => {
    isVisible.value = false
  }, 3000)
})
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed top-5 right-5 w-full max-w-sm z-50 shadow-sm p-5 flex items-start space-x-3 bg-white"
    role="alert" aria-live="assertive" :class="{
      'text-green-500 border border-green-500': type === 'success',
      'text-red-500 border border-red-500': type === 'error'
    }">
    <!-- Icon -->
    <svg v-if="type === 'success'" class="w-6 h-6 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>

    <svg v-if="type === 'error'" class="w-6 h-6 flex-shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>

    <!-- Message -->
    <div class="flex-1">
      <p class="font-medium">
        {{ message }}
      </p>
    </div>

    <!-- Dismiss button -->
    <button type="button" class="ml-auto text-sm cursor-pointer text-gray-500 hover:text-gray-800"
      aria-label="Close notification" @click="dismiss()">
      ✕
    </button>
  </div>
</template>