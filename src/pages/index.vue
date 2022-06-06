<template>
  <div>
    <router-link to="/pos/home">/pos/home</router-link>
    <button @click="insertIt">插入</button>
    {{cache.isLoading}}
    {{cache.loadingMessage}}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCacheStore } from '@/stores/cache';

const cache = useCacheStore();

const insertIt = () => {
  cache.cacheAll();
};
</script>

<style scoped></style>
