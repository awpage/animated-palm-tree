<script lang="ts" setup>
import useClientStorage from '~/composables/storage'


const { indexedDB } = useClientStorage()
const store = useClientStorage()

const device = defineModel()
const devices = computed(() => store?.devices.value || [])

const newDevice = ref()
const loading = ref(false)
const allDevices = ref<any[]>(devices.value)

function handleInput(evt: InputEvent | any) {
  newDevice.value = evt.target.value.slice(0, 7).toLowerCase()
}

function setAllDevices() {
  allDevices.value = [...allDevices.value, { id: newDevice.value, token: "" }]
  newDevice.value = undefined
}

watch(allDevices, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  indexedDB.add({ store: STORAGE_KEY, item: { id: STORAGE_KEY, val: JSON.stringify(newVal) } })
})
</script>

<template>
  <section class="p-5">
    <h2 class="text-xl">Add Device</h2>
    <form @submit.prevent="setAllDevices()" class="my-3 grid grid-cols-12 gap-5 items-start">
      <div class="col-span-9">
        <div class="border ring outline border-black outline-black ring-black w-full p-3 flex items-center gap-5">
          <label for="copy-id" class="sr-only">Device code</label>
          <input type="text" v-model="newDevice" max-length="4"
            class="w-full outline-none border-none ring-none bg-transparent uppercase tracking-[.3rem] font-black text-2xl"
            @input="handleInput" placeholder="Device Code" required />
        </div>
        <small>[Device code from your other device]</small>
      </div>
      <button type="submit"
        class="flex gap-2 items-center justify-center transition-all ease-in-out col-span-3 bg-black text-white h-auto py-4 px-5 cursor-pointer transform active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-700">
        <svg v-if="loading" class="w-[20px] animate-spin" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
          fill="currentColor">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M13.917 7A6.002 6.002 0 0 0 2.083 7H1.071a7.002 7.002 0 0 1 13.858 0h-1.012z"></path>
          </g>
        </svg>
        {{ loading ? '' : 'Add' }}
      </button>
    </form>

    <h2 class="text-xl">Your Devices</h2>
    <div class="font-bold border uppercase flex justify-between border-gray-300 p-2 cursor-pointer"
      @click="device === item.id ? device = undefined : device = item.id" :class="{ 'bg-gray-300': item.id === device }"
      v-for="(item, key) in allDevices" :key>
      {{ item.id }}

      <div class="border p-1 border-gray-300" :class="{ '!border-black': device === item.id }">
        <div class="h-full w-3" :class="{ 'bg-black': device === item.id }"></div>
      </div>
    </div>
  </section>
</template>