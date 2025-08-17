<script lang="ts" setup>
const route = useRoute()

const isHome = computed(() => route.path === "/")
</script>

<template>
  <section class="min-h-screen bg-slate-50" aria-labelledby="page-title">
    <nav v-if="!isHome" id="page-title"
      class="p-5 flex gap-2 justify-between text-3xl lg:text-8xl text-slate-400 tracking-tighter text-balance">
      <div class="flex gap-2">
        <nuxt-link to="/">How To&nbsp;</nuxt-link>
        <nuxt-link to="/copy" active-class="text-black">Copy</nuxt-link>
        <span class="text-black">,</span>
        <nuxt-link to="/paste" active-class="text-black">Paste & Share</nuxt-link>
      </div>
      <div />
    </nav>
    <NuxtPage class="h-full" />
  </section>
</template>
