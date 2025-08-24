<script lang="ts" setup>
import notify from '~/components/notify'

const pinError = ref(false)
const err = ref<string | undefined>(undefined)
const loading = ref(false)
const isMobile = ref(false)
const form = reactive({
  content: "",
  id: "",
  deleteOnSeen: false
})

async function submitForm() {
  err.value = undefined
  if (form.content.length === 0) {
    err.value = "Please add a content."
    return
  }

  loading.value = true
  try {
    await $fetch("/api/entry", { method: "post", body: JSON.stringify(form) })
    await copyToClipboard(false)

    form.content = ""
    form.id = ""
    form.deleteOnSeen = false

    // Get new pin for another entry
    await getPin()
    notify.show({ type: "success", message: "Content added and pin copied to clipboard" })
  } catch (error: any | { message: string }) {
    err.value = error.message.split(":")[1] ?? "An error occurred while saving your content, please try again."
  } finally {
    loading.value = false
  }
}

async function copyToClipboard(showMessage = true) {
  try {
    await navigator.clipboard.writeText(`Hey, I sent you something. See it here \nhttps://ctrlcv.website/c/${form.id}`)

    if (showMessage) {
      notify.show({ type: "success", message: "Code copied to your clipboard" })
    }
  } catch (error) {
    console.error(error)
    err.value = "An error occurred while copying the shareable code."
  }
}

async function shareId() {
  try {
    if (navigator.share) {
      navigator.share({
        title: 'Hey, I sent you something.',
        text: `See it here:\n`,
        url: `https://ctrlcv.website/c/${form.id}`,
      })
    }

    notify.show({ type: "error", message: "Cannot share " })
  } catch (error) {
    console.error(error)
    err.value = "Your device does not support sharing"
  }
}

async function getPin() {
  pinError.value = false
  err.value = undefined
  try {
    const { pin } = await $fetch("/api/pin")

    form.id = pin!
  } catch (error) {
    console.log(error)
    pinError.value = true
    err.value = "Error generating sharable pin, please refresh pin"
  }
}

getPin()

onMounted(() => {
  isMobile.value = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
})

useHead({
  title: "Paste and Share",
  meta: [{
    content: "Paste your content and get a shareable code to protect your secret. Items are encryoted and except you share the code, it is locked FOREVER.",
    name: "description"
  }]
})
</script>

<template>
  <section class="p-5 flex flex-col gap-5" aria-labelledby="page-title">
    <form @submit.prevent="submitForm" class="grid gap-5 lg:grid-cols-3 lg:h-[78vh]" aria-describedby="form-desc">
      <div class="h-[60vh] lg:col-span-2 lg:h-full flex flex-col gap-5">
        <div v-if="err" class="border border-red-500 outline-red-500 ring ring-red-500 text-red-500 p-5"
          aria-describedby="form-errors" role="alert" aria-live="assertive" id="form-errors">
          {{ err }}
        </div>
        <label for="content" class="sr-only">Paste your content here</label>
        <textarea id="content" v-model="form.content"
          class="h-full resize-none bg-transparent border border-slate-400 ring ring-slate-400 outline outline-slate-400 focus:ring-black focus:outline-black focus:border-black p-5 font-sans"
          placeholder="Paste your content here" aria-describedby="form-desc" requir></textarea>
      </div>

      <div class="flex flex-col gap-5">
        <div class="mb-5 flex items-start gap-5">
          <input type="checkbox" id="delete-on-seen" v-model="form.deleteOnSeen" class="sr-only" />
          <label for="delete-on-seen" class="flex items-center gap-3 cursor-pointer select-none">
            <span
              class="inline-flex items-center justify-center p-1 border ring outline border-black outline-black ring-black"
              aria-hidden="true">
              <svg class="w-8" :class="{ 'opacity-0': !form.deleteOnSeen }" viewBox="0 0 512 512" version="1.1"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                <g id="SVGRepo_iconCarrier">
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="add" fill="#000000" transform="translate(91.581722, 94.833062)">
                      <polygon id="check-small"
                        points="304.534538 0 340.035351 23.6672084 154.934008 301.319223 1.42108547e-14 146.385216 30.1698893 116.215326 148.290278 234.318938">
                      </polygon>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            <span class="flex flex-col">
              Delete on copy
              <small class="text-xs text-gray-600">
                [{{ !form.deleteOnSeen ? 'Save the planet, t' : 'T' }}his will {{ !form.deleteOnSeen ? 'not' : '' }}
                self-destruct when copied]
              </small>
            </span>
          </label>
        </div>
        <div class="border ring outline border-black outline-black ring-black w-full p-3 flex items-center gap-5">
          <label for="copy-id" class="sr-only">Your unique paste ID</label>
          <input id="copy-id" type="text" v-model="form.id" readonly placeholder="Getting your code..."
            class="w-full outline-none border-none ring-none bg-transparent uppercase tracking-[.3rem] font-black text-2xl" />

          <button v-if="pinError" type="button" @click="getPin()" class="cursor-pointer transform active:scale-95"
            aria-label="Reload paste ID">
            <svg class="w-9" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M22,6V21a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V6A1,1,0,0,1,3,5H9.586L8.293,3.707A1,1,0,0,1,9.707,2.293l3,3a.99.99,0,0,1,.217.326,1,1,0,0,1,0,.764.99.99,0,0,1-.217.326l-3,3A1,1,0,0,1,8.293,8.293L9.586,7H4V20H20V7H16a1,1,0,0,1,0-2h5A1,1,0,0,1,22,6Z">
                </path>
              </g>
            </svg>
          </button>
          <button v-else-if="isMobile" type="button" @click="shareId()" class="cursor-pointer transform active:scale-95"
            aria-label="Share paste ID">
            <svg class="w-10" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="icon" fill="#000000" transform="translate(42.666667, 42.666667)">
                    <path
                      d="M352,277.333333 C330.312533,277.333333 310.953173,286.729173 297.312427,301.494827 L148.109227,236.136747 C148.763093,232.164053 149.333333,228.157653 149.333333,224 C149.333333,216.23168 147.8112,208.889387 145.610667,201.8464 L297.605547,125.527467 C311.231787,140.096427 330.477867,149.333333 352,149.333333 C393.236907,149.333333 426.666667,115.903573 426.666667,74.6666667 C426.666667,33.42976 393.236907,3.55271368e-14 352,3.55271368e-14 C310.763093,3.55271368e-14 277.333333,33.42976 277.333333,74.6666667 C277.333333,79.0065067 277.899733,83.2004267 278.610773,87.3371733 L121.455787,166.246187 C108.619733,155.832107 92.4829867,149.333333 74.6666667,149.333333 C33.42976,149.333333 3.55271368e-14,182.763093 3.55271368e-14,224 C3.55271368e-14,265.236907 33.42976,298.666667 74.6666667,298.666667 C96.3541333,298.666667 115.713493,289.270827 129.35424,274.505173 L278.55744,339.863253 C277.903573,343.835947 277.333333,347.842347 277.333333,352 C277.333333,393.236907 310.763093,426.666667 352,426.666667 C393.236907,426.666667 426.666667,393.236907 426.666667,352 C426.666667,310.763093 393.236907,277.333333 352,277.333333 Z M352,42.6666667 C369.644587,42.6666667 384,57.02208 384,74.6666667 C384,92.3112533 369.644587,106.666667 352,106.666667 C334.355413,106.666667 320,92.3112533 320,74.6666667 C320,57.02208 334.355413,42.6666667 352,42.6666667 Z M74.6666667,256 C57.02208,256 42.6666667,241.644587 42.6666667,224 C42.6666667,206.355413 57.02208,192 74.6666667,192 C92.3112533,192 106.666667,206.355413 106.666667,224 C106.666667,241.644587 92.3112533,256 74.6666667,256 Z M352,384 C334.355413,384 320,369.644587 320,352 C320,334.355413 334.355413,320 352,320 C369.644587,320 384,334.355413 384,352 C384,369.644587 369.644587,384 352,384 Z"
                      id="Shape"> </path>
                  </g>
                </g>
              </g>
            </svg>
          </button>
          <button v-else type="button" @click="copyToClipboard()" class="cursor-pointer transform active:scale-95"
            aria-label="Copy paste ID to clipboard">
            <svg class="w-10" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path
                d="M341.33,85.33V405.33H85.33V85.33H341.33ZM298.67,128H128V362.67H298.67V128ZM234.67,0V42.67H42.67V298.67H0V0H234.67Z" />
            </svg>
          </button>
        </div>
        <button type="submit"
          class="bg-black text-white w-full p-5 cursor-pointer transform active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-700"
          aria-label="Save your paste" :disabled="loading">
          {{ loading ? "Saving..." : "Save" }}
        </button>
      </div>
    </form>
  </section>

</template>