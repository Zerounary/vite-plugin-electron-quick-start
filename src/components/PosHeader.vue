<template>
  <div class="grid grid-cols-2 items-center h-50px shadow bg-white">
    <div class="text-left flex items-center ">
      <Icon icon="material-symbols:store-outline" width="24" height="24" />
      <div>门店管理</div>
    </div>
    <div class="flex items-center justify-end ">
      <Icon icon="bxs:user" width="24" height="24" />
      <div>系统管理员</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style scoped></style>
