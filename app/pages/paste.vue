<script lang="ts" setup>
const pinError = ref(false)
const form = reactive({
  content: "",
  id: "",
  deleteOnSeen: false
})

function submitForm() {
  console.log("Form")
}

function copyToClipboard() { }

function getPin() {}
</script>

<template>
  <section class="p-5 flex flex-col gap-5" aria-labelledby="page-title">
    <h1 id="page-title" class="text-4xl lg:text-8xl text-black tracking-tighter text-balance">
      <span class="text-slate-400">Copy, </span>Paste & Share
    </h1>

    <form @submit.prevent="submitForm" class="grid gap-5 lg:grid-cols-3 lg:h-[80vh]" aria-describedby="form-desc">
      <div class="h-[60vh] lg:col-span-2 lg:h-full flex flex-col">
        <label for="content" class="sr-only">Paste your content here</label>
        <textarea id="content" v-model="form.content"
          class="h-full border border-slate-400 ring ring-slate-400 outline outline-slate-400 focus:ring-black focus:outline-black focus:border-black p-5 font-sans"
          placeholder="Paste your content here" aria-describedby="form-desc" required></textarea>
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
            class="w-full outline-none border-none ring-none bg-transparent" />

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
          <button v-else type="button" @click="copyToClipboard()" class="cursor-pointer transform active:scale-95"
            aria-label="Copy paste ID to clipboard">
            <svg class="w-10" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path
                d="M341.33,85.33V405.33H85.33V85.33H341.33ZM298.67,128H128V362.67H298.67V128ZM234.67,0V42.67H42.67V298.67H0V0H234.67Z" />
            </svg>
          </button>
        </div>
        <button type="submit" class="bg-black text-white w-full p-5 cursor-pointer transform active:scale-95"
          aria-label="Save your paste">
          Save
        </button>
      </div>
    </form>
  </section>

</template>