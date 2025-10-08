<script lang="ts" setup>
import notify from '~/components/notify'
import useClientStorage from '~/composables/storage';

const { recipient } = defineProps<{ recipient: string | null }>()
const emit = defineEmits(["change-recipient"])

const store = useClientStorage()

const err = ref<string | undefined>(undefined)
const loading = ref(false)
const form = reactive({
  content: "",
})

const { gtag } = useGtag()
const device = inject("deviceId")

async function submitForm() {
  err.value = undefined
  if (form.content.length === 0) {
    notify.show({ type: "error", message: "Please add some content" })
    return
  }

  if (!recipient) {
    notify.show({ type: "error", message: "Please select the recieving device" })
    return
  }

  loading.value = true
  try {
    const { message } = await $fetch("/api/device-to-device/message/send", {
      method: "post", body: JSON.stringify({
        content: form.content,
        recipientId: recipient,
        senderId: device.value
    }) })

    form.content = ""
    store?.addMessageToStore([message, ...store.messages.value])
    

    notify.show({ type: "success", message: "Message sent!" })
    gtag("event", "message_sent")
  } catch (error: any | { message: string }) {
    err.value = error.message.split(":")[1] ?? "An error occurred while saving your content, please try again."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="p-5" aria-labelledby="page-title">
    <form @submit.prevent="submitForm" class="w-full grid grid-cols-2 gap-5 items-center lg:h-[50vh]"
      aria-describedby="form-desc">
      <div class="h-[40vh] lg:col-span-2 col-span-2 flex flex-col gap-5">
        <div v-if="err" class="border border-red-500 outline-red-500 ring ring-red-500 text-red-500 p-5"
          aria-describedby="form-errors" role="alert" aria-live="assertive" id="form-errors">
          {{ err }}
        </div>
        <label for="content" class="sr-only">Paste your content here</label>
        <textarea id="content" v-model="form.content"
          class="h-full resize-none bg-transparent border border-slate-400 ring ring-slate-400 outline outline-slate-400 focus:ring-black focus:outline-black focus:border-black p-5 font-sans"
          placeholder="Paste your content here" aria-describedby="form-desc" requir></textarea>
      </div>

      <div class="">
        Sending to:
        <button type="button" class="text-blue-500 cursor-pointer" @click="emit('change-recipient')">
          <span class="text-blue-700 uppercase">{{ recipient }}</span> {{ recipient ? 'change' : 'Select device' }}
        </button>
      </div>
      <button type="submit"
        class="flex gap-2 items-center justify-center bg-black text-white p-5 cursor-pointer transform active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-700"
        aria-label="Save your paste" :disabled="loading">
        <svg v-if="loading" class="w-[20px] animate-spin" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
          fill="currentColor">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M13.917 7A6.002 6.002 0 0 0 2.083 7H1.071a7.002 7.002 0 0 1 13.858 0h-1.012z"></path>
          </g>
        </svg>
        {{ loading ? "Sending..." : "Send" }}
      </button>
    </form>
  </section>
</template>