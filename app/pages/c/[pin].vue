<script setup lang="ts">
import Copy from '../copy.vue';
</script>

<template>
  <Copy :title="`Copy item with key: ` + $route.params.pin.toUpperCase()" />
</template>