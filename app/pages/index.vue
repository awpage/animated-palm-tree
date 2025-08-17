<script lang="ts" setup>
const count = ref(0)

const platform = ref({ isMac: false, isWindows: false })

const { data, error } = await useAsyncData(() => $fetch("/api/count"))

if (data.value) {
  count.value = data.value.count
}

if (error.value) {
  console.error(error.value)
}

onMounted(() => {
  const _platform = navigator.userAgent?.platform || navigator.platform || ''

  platform.value = {
    isMac: /Mac/i.test(_platform),
    isWindows: !(/Mac/i.test(_platform))
  }
})

</script>
<template>
  <section class="bg-slate-50 h-screen flex flex-col justify-between p-5">
    <div class="">
      <div class="flex gap-5 items-center justify-between">
        <h1 class="text-3xl lg:text-8xl text-black tracking-tighter text-balance">
          How To Copy, Paste and Share!
        </h1>

        <nuxt-link to="/paste"
          class="bg-black text-white text-center py-5 w-[30vw] lg:w-[10vw] cursor-pointer transform active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-700">
          Try it!
        </nuxt-link>

      </div>

      <section class="my-10 h-[60vh] lg:grid lg:grid-cols-5 gap-5">
        <div class="lg:col-span-3 grid grid-cols-3 lg:grid-cols-5 grid-rows-2 gap-5 w-full h-full">
          <div class="col-span-3 lg:col-span-2 row-span-2 bg-black text-white p-5">
            <div class="mb-12">
              <div class="flex items-end">
                <h2 class="font-bold text-4xl">Copy</h2>
                &nbsp;
                <span class="opacity-75">{{ platform.isMac ? "[⌘+c]" : platform.isWindows ? "[Ctrl+c]" : "" }}</span>
              </div>
              <p class="mt-3 opacity-75 font-[100]">
                Get the textual content from where ever you want, copied to your system's clipboard.
              </p>
            </div>
            <nuxt-link to="/copy">Copy content with a password here</nuxt-link>
          </div>
          <div class="col-span-2 lg:col-span-3 row-span-1 bg-black text-white p-5 flex flex-col justify-between">
            <div class="">
              <div class="flex items-end">
                <h2 class="font-bold text-4xl">Paste</h2>
                &nbsp;
                <span class="opacity-75">{{ platform.isMac ? "[⌘+v]" : platform.isWindows ? "[Ctrl+v]" : "" }}</span>
              </div>
              <p class="mt-3 opacity-75 font-[100]">
                Paste your content and get a shareable code to protect your secret. Items are encryoted and except you
                share the code, it is locked FOREVER.
              </p>
            </div>

            <nuxt-link to="/paste">Paste and Share here</nuxt-link>
          </div>
          <div class="col-span-2 row-span-1 bg-black text-white"></div>
        </div>
        <div class="flex lg:col-span-2 bg-transparent text-black flex-col justify-end items-end">
          <p class="">Tokens left</p>
          <h3 class="text-2xl lg:text-6xl text-right">
            {{ (64_339_296_875 - count).toLocaleString() }}
          </h3>
        </div>
      </section>
    </div>

    <div class="flex items-center justify-between">
      &copy; Booluw

      <a href="//beawesome.page" target="_blank"
        class="cursor-pointer font-bold opacity-50 hover:opacity-100 ease-in-out lowercase">
        awwpa
      </a>
    </div>
  </section>
</template>