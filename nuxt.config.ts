// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  fonts: {
    families: [
      {
        name: "",
        provider: "google",
        global: true,
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Ctrl+CV",
            alternateName: "Ctrl CV",
            url: "https://ctrlcv.website",
          }),
        },
      ],
    },
  },
  nitro: {
    experimental: {
      websocket: true
    },
  },

  gtag: {
    enabled: Boolean(process.env.VITE_PROD),
    id: process.env.VITE_PUBLIC_GTAG_ID,
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "nuxt-gtag",
  ],
});