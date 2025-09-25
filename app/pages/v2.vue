<script lang="ts" setup>
import useClientStorage from '~/composables/storage';
import type { ServerMessage, UserNotification } from '~/types/sse';

const paste = reactive<{ device: null | string, content: string}>({
  device: null,
  content: ''
})

const store = useClientStorage()
let source = null

const selectRecipient = ref(false)
const sseConnected = ref(false)
const bannerContent = ref("Please wait...")
const isRecievingMessages = ref(false) // used to hide the paste dialog

const device = computed(() => store?.deviceID.value)
const devices = computed(() => store?.devices.value || [])
const messages = computed(() => store?.messages.value || [])

const startListening = function () {
  source = new EventSource(`/api/v2/${device.value}/sse`)

  source.onopen = () => {
    sseConnected.value = true
  }

  source.onmessage = (event) => {
    const { message } = JSON.parse(event.data) as { time: string, message: ServerMessage }

    switch (message.type) {
      case 'connected':
        if (message.recipientId === device.value) {
          if (!devices.value.includes(message.senderId)) {
            store?.addDeviceToStore([message.senderId, ...devices.value])
          }

          paste.device = message.senderId as string
          changeBannerContent(`New device [${message.senderId?.toLocaleUpperCase()}] connected`)
        }
        break;
      case 'message':
        if (!messages.value.map((mes) => mes.id).includes(message.id)) {
          isRecievingMessages.value = true
          store?.addMessageToStore([message, ...messages.value])
        }
        break

      case 'ping':
        // console.log("ping", message)
        break

      case "welcome":
        console.warn("welcome", message)
      default:
        break;
    }
  }
}

const updateMessageStatus = function (id: string) {
  console.log({ id })
  navigator.sendBeacon("/api/v2/update-message", JSON.stringify({ id }))
}

const notifyUser = function (item: UserNotification) {
  if (!("Notification" in window)) {
    console.warn("Can't send")
    // browser does not support notifications
    if (confirm(item.body)) {
      item.callback()
    } else {
      console.log("User clicked on no")
    }
  } else if (Notification.permission === "granted") {
    console.log("Alerted")
    // Permission granted, proceed
    new Notification(item.title, { body: item.body })
  } else if (Notification.permission !== "denied") {
    console.error("Denied")
    // Ask for permission
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("We can send you notifications!!", { body: "Any new message sent will trigger a notification from us, so you won't miss anything." })
      } else {
        alert("Hey, we'll be sending alerts instead of notifications. Thank you.")
      }
    })
  }
}

const changeBannerContent = function (content: string) {
  bannerContent.value = content

  setTimeout(() => {
    bannerContent.value = `${sseConnected.value ? 'Connected' : 'Connecting'} to server`
  }, 9000);
}

watch(device, (newVal) => {
  if (newVal) {
    startListening()
  }
})

watch(sseConnected, (newVal) => {
  if (newVal) {
    bannerContent.value = "Connected to server"
    return
  }

  bannerContent.value = "Connecting to server"
})

if (import.meta.client) {
  document.addEventListener("visibilitychange", () => {
    console.log(document.visibilityState)
    // Send a beacon to the backend to stop sending when user is not in the page.
  })
}
</script>
<template>
  <ClientOnly>
    <div class="p-5 bg-orange-100 text-orange-700 text-center font-bold sticky top-0 z-[9]"
      :class="{ '!bg-green-100 !text-green-700' : sseConnected }">
      {{ bannerContent }}
    </div>
    <section class="relative flex flex-col gap-5 !h-full">
      <div class="px-5 flex -my-10">
        <svg class="w-40" :class="{ 'fill-green-500': device }" viewBox="0 0 478.45 478.451" xml:space="preserve">
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M7.898,180.559c-4.37,0-7.898,3.538-7.898,7.918v101.487c0,4.369,3.528,7.918,7.898,7.918h53.215 c4.36,0,7.898-3.549,7.898-7.918V188.477c0-4.38-3.538-7.918-7.898-7.918H7.898z M34.396,222.07c-0.86,0-1.559-0.698-1.559-1.549 c0-0.87,0.698-1.559,1.559-1.559c0.861,0,1.559,0.688,1.559,1.559C35.955,221.362,35.257,222.07,34.396,222.07z M34.396,212.89 c-2.61,0-4.733-2.123-4.733-4.714c0-2.611,2.123-4.733,4.733-4.733c2.611,0,4.724,2.123,4.724,4.733 C39.12,210.767,36.997,212.89,34.396,212.89z M51.628,196.395H17.165c-1.081,0-1.97-0.879-1.97-1.96c0-1.09,0.889-1.97,1.97-1.97 h34.463c1.081,0,1.96,0.88,1.96,1.97C53.588,195.515,52.708,196.395,51.628,196.395z">
              </path>
            </g>
          </g>
        </svg>

        <svg class="-ml-40 w-40 animate-pulse" :class="{ 'fill-green-400 !animate-none': sseConnected }"
          viewBox="0 0 478.45 478.451" xml:space="preserve">
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M125.278,258.732c-2.525,0.899-3.854,3.673-2.984,6.178c0.431,1.234,1.31,2.209,2.486,2.783 c0.66,0.314,1.396,0.488,2.123,0.488c0.526,0,1.042-0.086,1.559-0.26c12.25-4.188,20.483-15.729,20.483-28.696 c0-11.838-6.952-22.673-17.738-27.617c-1.014-0.459-2.094-0.879-3.175-1.214c-2.438-0.812-5.279,0.564-6.158,3.251 c-0.086,0.334-0.191,0.793-0.191,1.358c0,2.123,1.348,3.978,3.356,4.628c0.717,0.229,1.444,0.517,2.142,0.832 c7.325,3.328,12.058,10.691,12.058,18.762C139.22,248.033,133.626,255.874,125.278,258.732z">
              </path>
              <path
                d="M136.753,280.63c0.641,0,1.282-0.123,1.884-0.373c16.524-7,27.215-23.121,27.215-41.08c0-15.94-8.597-30.772-22.443-38.699 c-1.549-0.89-3.175-1.702-4.791-2.372c-1.195-0.526-2.572-0.545-3.749-0.058c-1.205,0.488-2.151,1.406-2.648,2.592 c-0.249,0.593-0.392,1.252-0.392,1.903c0,1.941,1.119,3.663,2.983,4.494c1.281,0.545,2.562,1.147,3.777,1.865 c10.834,6.197,17.566,17.796,17.566,30.266c0,14.056-8.357,26.66-21.324,32.13c-2.429,1.061-3.576,3.91-2.553,6.33 C133.014,279.455,134.783,280.63,136.753,280.63z">
              </path>
              <path
                d="M144.7,293.31c0.65,0,1.291-0.133,1.884-0.383c21.621-9.131,35.591-30.207,35.591-53.692 c0-22.539-13.206-43.271-33.641-52.823c-0.669-0.316-1.339-0.593-1.989-0.871c-1.167-0.497-2.477-0.535-3.739-0.038 c-1.167,0.469-2.132,1.416-2.639,2.611c-0.249,0.631-0.382,1.252-0.382,1.884c0,1.951,1.167,3.71,2.964,4.465 c0.564,0.229,1.09,0.479,1.673,0.756c17.031,7.927,28.037,25.207,28.037,44.006c0,19.565-11.647,37.132-29.663,44.753 c-2.448,1.023-3.615,3.863-2.582,6.359C140.97,292.144,142.739,293.31,144.7,293.31z">
              </path>
            </g>
          </g>
        </svg>

        <svg class="-ml-20 w-40" :class="{ 'fill-green-700' : paste.device }" viewBox="0 0 478.45 478.451"
          xml:space="preserve">
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M7.898,180.559c-4.37,0-7.898,3.538-7.898,7.918v101.487c0,4.369,3.528,7.918,7.898,7.918h53.215 c4.36,0,7.898-3.549,7.898-7.918V188.477c0-4.38-3.538-7.918-7.898-7.918H7.898z M34.396,222.07c-0.86,0-1.559-0.698-1.559-1.549 c0-0.87,0.698-1.559,1.559-1.559c0.861,0,1.559,0.688,1.559,1.559C35.955,221.362,35.257,222.07,34.396,222.07z M34.396,212.89 c-2.61,0-4.733-2.123-4.733-4.714c0-2.611,2.123-4.733,4.733-4.733c2.611,0,4.724,2.123,4.724,4.733 C39.12,210.767,36.997,212.89,34.396,212.89z M51.628,196.395H17.165c-1.081,0-1.97-0.879-1.97-1.96c0-1.09,0.889-1.97,1.97-1.97 h34.463c1.081,0,1.96,0.88,1.96,1.97C53.588,195.515,52.708,196.395,51.628,196.395z">
              </path>
            </g>
          </g>
        </svg>
      </div>

      <div class="text-2xl px-5">
        Device ID: <span class="uppercase">{{ device }}</span>
      </div>
      <div class="grid lg:grid-cols-3 gap-5">
        <div class="lg:col-span-2 px-5">
          <div class="border border-gray-300" :class="{ 'bg-gray-50': isRecievingMessages }">
            <div class="font-bold px-5 py-3 flex justify-between items-center cursor-pointer"
              :class="{ 'border-b border-gray-300': isRecievingMessages }"
              @click="isRecievingMessages = !isRecievingMessages">
              Messages
              <span class="inline-block py-.5 px-2 bg-black text-white">
                {{ messages.length }}
              </span>
            </div>
            <div class="pb-5" v-if="isRecievingMessages">
              <D2dMessages />
            </div>
          </div>
          <div class="border border-gray-300" :class="{ 'bg-gray-50': !isRecievingMessages }">
            <div class="font-bold px-5 py-3 flex justify-between items-center cursor-pointer"
              :class="{ 'border-b border-gray-300': !isRecievingMessages }"
              @click="isRecievingMessages = !isRecievingMessages">
              Paste
            </div>
            <D2dPaste :recipient="paste.device" @change-recipient="selectRecipient = true"
              v-if="!isRecievingMessages" />
          </div>
        </div>
        <div class="">
          <D2dSelectDevice v-model="paste.device"
            @update:model-value="(val) => { paste.device = val; selectRecipient = false }" v-if="selectRecipient" />
          <div class="p-5 hidden min-md:block" v-else>
            We can add some FAQ here?
          </div>
        </div>
      </div>
    </section>
  </ClientOnly>
</template>