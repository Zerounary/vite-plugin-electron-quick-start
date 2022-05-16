<template>
  <div>
    <div class="grid grid-cols-2 items-center h-50px shadow-xl bg-blue-500 text-white px-3">
      <div class="text-left flex items-center ">
        <div class="text-2xl">{{storeStore.name}}</div>
      </div>
      <div class="flex items-center justify-end space-x-3 ">
        <div>库存总量：{{storeStore.storageQty}}</div>
        <div>会员总数：{{storeStore.vipNum}}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userStoreStore } from '../stores/store';

const storeStore = userStoreStore();

</script>

<style scoped>

</style>