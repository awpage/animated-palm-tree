<script lang="ts" setup>
const device = defineModel()
const newDevice = ref()

const allDevices = ref(JSON.parse(localStorage.getItem(STORAGE_KEY)!) || [])

function handleInput(evt: InputEvent | any) {
  newDevice.value = evt.target.value.slice(0, 4).toLowerCase()
}

function setAllDevices() {
  // Check if device is in the db.
  allDevices.value = [...allDevices.value, newDevice.value]
}

watch(allDevices, (newVal) => {
  console.log("Hello World")
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
})
</script>
<template>
  <section class="p-5">
    <h2 class="text-3xl">Your Devices</h2>
    <form @submit.prevent="setAllDevices()" class="my-3 flex items-start gap-5">
      <div class="col-span-10">
        <div class="border ring outline border-black outline-black ring-black w-full p-3 flex items-center gap-5">
          <label for="copy-id" class="sr-only">Device code</label>
          <input type="text" v-model="newDevice" max-length="4"
            class="w-full outline-none border-none ring-none bg-transparent uppercase tracking-[.3rem] font-black text-2xl"
            @input="handleInput" placeholder="Device Code" required />
        </div>
        <small>[Device code from your other device]</small>
      </div>
      <button type="submit"
        class="col-span-2 bg-black text-white h-auto py-4 px-5 cursor-pointer transform active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-700"
      >
        Add Device
      </button>
    </form>
    {{ allDevices }}
    Hello
  </section>
</template>