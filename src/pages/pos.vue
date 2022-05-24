<template>
  <div class="space-y-3">
    <PosHeader />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import PosHeader from "@/components/PosHeader.vue";
</script>

<style scoped></style>
