<script lang="ts" setup>
const route = useRoute()

const isHome = computed(() => route.path === "/")
let script: any = []

if (import.meta.env.VITE_PROD) {
  script = [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_PUBLIC_GTAG_ID}`,
      async: true
    },
    {
      type: 'text/javascript',
      children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${import.meta.env.VITE_PUBLIC_GTAG_ID}';
        `
    }
  ]

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_PUBLIC_GTAG_ID}`,
        async: true
      },
      {
        type: 'text/javascript',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${import.meta.env.VITE_PUBLIC_GTAG_ID}';
        `
      }
    ]
  })
}

useHead({
  titleTemplate: " %s | Copy, Paste and Share with the world",
  link: [
    {
      rel: "icon",
      type: "image/vnd.microsoft.icon",
      href: "https://res.cloudinary.com/dzhxwku5k/image/upload/v1755942251/favicon_ob7dis.ico"
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "https://res.cloudinary.com/dzhxwku5k/image/upload/v1755942249/favicon-32x32_umddv2.png"
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      href: "https://res.cloudinary.com/dzhxwku5k/image/upload/v1755942242/android-chrome-192x192_kpqllg.png"
    }
  ],
  meta: [
    { property: 'og:title', content: 'Copy, Paste and Share with the world' },
    { property: 'og:description', content: 'Paste your content and get a shareable code to protect your secret. Items are encryoted and except you share the code, it is locked FOREVER.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://ctrlcv.website/' },
    { property: 'og:image', content: 'https://res.cloudinary.com/dzhxwku5k/image/upload/v1755948873/Group_3_z0tpfb.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Copy, Paste and Share with the world' },
    { name: 'twitter:description', content: 'Paste your content and get a shareable code to protect your secret. Items are encryoted and except you share the code, it is locked FOREVER.' },
    { name: 'twitter:image', content: 'https://res.cloudinary.com/dzhxwku5k/image/upload/v1755948873/Group_3_z0tpfb.png' },
    { name: 'author', content: 'awwesome pages' },
  ],
})
</script>

<template>
  <section class="min-h-screen bg-slate-50" aria-labelledby="page-title">
    <nav v-if="!isHome" id="page-title"
      class="p-5 flex gap-2 justify-between text-3xl lg:text-8xl text-slate-400 tracking-tighter text-balance">
      <div class="flex gap-2">
        <nuxt-link to="/">Help,&nbsp;</nuxt-link>
        <nuxt-link to="/copy" active-class="text-black">Copy</nuxt-link>
        <span class="text-black">,</span>
        <nuxt-link to="/paste" active-class="text-black">Paste & Share</nuxt-link>
      </div>
      <div />
    </nav>
    <NuxtPage class="h-full" />
  </section>
</template>
