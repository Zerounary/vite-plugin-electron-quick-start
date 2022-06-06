<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class=" w-300px h-200px pt-30px text-center text-xl">{{ cache.loadingMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ElLoading } from "element-plus";
import { useCacheStore } from "@/stores/cache";

const cache = useCacheStore();

onMounted(async () => {
  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    background: "rgba(0, 0, 0, 0.7)",
  });
  await cache.cacheAll();
  loading.close();
  router.push("/pos/home");
});
</script>

<style scoped></style>
