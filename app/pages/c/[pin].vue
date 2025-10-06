<script setup lang="ts">
import Copy from '../copy.vue';

definePageMeta({
  name: "url-share"
})
</script>

<template>
  <Copy :title="`Copy item with key: ` + $route.params.pin.toUpperCase()" />
</template>