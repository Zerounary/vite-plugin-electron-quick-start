<template>
  <div>
    <router-link to="/pos/home">/pos/home</router-link>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
authStore.logout();
</script>

<style scoped>

</style>