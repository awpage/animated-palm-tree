<script lang="ts" setup>
import notify from '~/components/notify'

const route = useRoute()

const loading = ref(false)
const pin = ref(route.params.pin ?? "")

const content = ref(undefined)

function handleInput(evt: InputEvent | any) {
  pin.value = evt.target.value.slice(0, 7)
}

async function submitPin() {
  if (content.value) {
    try {
      await navigator.clipboard.writeText(content.value?.content)

      if (content.value?.deleteOnSeen) {
        await $fetch(`/api/entry?pin=${pin.value}`, { method: "delete" })
      }

      notify.show({ type: "success", message: "Content copied to your clipboard" })
    } catch (error) {
      console.error(error)
      notify.show({ type: "error", message: "An error occurred while copying content" })
    }
    return
  }

  loading.value = true

  try {
    const { content: data } = await $fetch(`/api/entry?pin=${pin.value}`)
    content.value = data

    if (import.meta.client) {
      window.history.pushState({}, '', `/copy/${pin.value}`)
    }
  } catch (error) {
    console.error(error)

    notify.show({ type: "error", message: error.message.split(":")[1] ?? "An Error occurred, that's all we know" })
  } finally {
    loading.value = false
  }
}

useHead({
  title: "Copy",
  meta: [{
    content: "Get the textual content from where ever you want, copied to your system's clipboard.",
    name: "description"
  }]
})
</script>

<template>
  <section class="p-5 !h-[87vh] lg:!h-[80vh] flex max-lg:flex-col gap-5 lg:items-start">
    <form @submit.prevent="submitPin" class="lg:w-1/2 flex lg:grid grid-cols-12 gap-2 lg:gap-5 items-start">
      <div v-if="!content" class="col-span-10">
        <div class="border ring outline border-black outline-black ring-black w-full p-3 flex items-center gap-5">
          <label for="copy-id" class="sr-only">Your unique paste ID</label>
          <input type="text" v-model="pin" max-length="7"
            class="w-full outline-none border-none ring-none bg-transparent uppercase tracking-[.3rem] font-black text-2xl"
            @input="handleInput" placeholder="Password" required />
        </div>
        <small>[Password given to protect this content]</small>
      </div>

      <button type="submit"
        class="col-span-2 bg-black text-white h-auto py-4 px-5 cursor-pointer transform active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-700"
        :class="{ 'w-full col-span-12' : content }" :disabled="loading">
        {{ content ? "Copy" : loading ? "Checking" : "Check" }}
      </button>
    </form>

    <div v-if="content" class="lg:w-1/2 h-full flex flex-col gap-5">
      <div v-if="content?.deleteOnSeen"
        class="p-5 bg-amber-50 text-amber-500 border border-amber-500 ring ring-amber-500 outline outline-amber-500">
        <b class="font-bold">Heads Up!</b> This content will be deleted from our database once you click "Copy" as it was placed on self-destruct
      </div>
      <div
        class="h-full overflow-auto resize-none bg-transparent border ring outline ring-black outline-black border-black p-5 font-sans whitespace-pre-wrap">
        {{ content?.content }}</div>
    </div>
  </section>
</template>