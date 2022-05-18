<template>
  <div>
    <div class="grid grid-cols-2 items-center h-50px shadow bg-white h-60px px-3">
      <div class="text-left flex items-center space-x-6 ">
        <div class="text-xl font-bold">{{storeStore.name}}</div>
      </div>
      <div class="flex items-center justify-end space-x-3 ">
        <div class="text-gray-500" >库存总量：{{storeStore.storageQty}}</div>
        <div class="text-gray-500" >会员总数：{{storeStore.vipNum}}</div>
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