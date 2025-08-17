<template>
  <section class="min-h-screen" aria-labelledby="page-title">
    <nav id="page-title" class="p-5 flex gap-2 text-4xl lg:text-8xl text-slate-400 tracking-tighter text-balance">
      <nuxt-link to="/copy" exact-active-class="text-black">Copy</nuxt-link>
      <span class="text-black">,</span>
      <nuxt-link to="/paste" exact-active-class="text-black">Paste & Share</nuxt-link>
    </nav>
    <NuxtPage class="h-full" />
  </section>
</template>
