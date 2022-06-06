<template>
  <div>
    <router-link to="/pos/home">/pos/home</router-link>
    <button @click="insertIt">插入</button>
    {{cache.isLoading}}
    {{cache.loadingMessage}}
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCacheStore } from '@/stores/cache';

const cache = useCacheStore();

onMounted(async () => {
  await cache.cacheAll();
  router.push("/pos/home");
})
</script>

<style scoped></style>
