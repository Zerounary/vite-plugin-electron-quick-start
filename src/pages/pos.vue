<template>
  <div>
    <PosHeader class="mb-3" />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import PosHeader from "@/components/PosHeader.vue";
</script>

<style scoped></style>
