<template>
  <div class="drag grid grid-cols-2 items-center h-60px shadow bg-white px-3">
    <div class="text-left flex items-end space-x-3">
      <div class="text-xl font-bold">{{ storeStore.name }}</div>
      <div class="flex text-sm space-x-3">
        <div class="text-gray-500">
          库存总量：{{ toLocaleString(storeStore.storageQty) }}
        </div>
        <div class="text-gray-500">
          会员总数：{{ toLocaleString(storeStore.vipNum) }}
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-3">
      <router-link v-if="isInPos" class="no-drag flex items-end" to="/pos/home">
        <Icon icon="bxs:home" width="24" height="24" />
        <span class="text-16px">首页</span>
      </router-link>
      <router-link v-if="isInHome" class="no-drag flex items-end" to="/pos/pos">
        <Icon icon="mdi:network-pos" width="24" height="24" />
        <span class="text-16px">POS</span>
      </router-link>
      <Icon icon="bxs:user" width="24" height="24" />
      <Icon
        icon="ant-design:logout-outlined"
        class="cursor-pointer no-drag"
        title="点击退出"
        color="#ef4444"
        width="24"
        height="24"
        @click="quit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { rendererSend } from "~/electron-main/common/ipcRender";
import ipcNames from "~/electron-main/common/ipcNames";
import { toLocaleString } from "@/util/format";
import { userStoreStore } from "../stores/store";
import { computed } from "vue";

const storeStore = userStoreStore();

let quit = () => {
  // rendererSend(ipcNames.quit, null);
  router.push('/login');
};

const isInPos = computed(() => {
  console.log("🚀 ~ file: PosHeader.vue ~ line 53 ~ isInPos ~ router", router.currentRoute.value.path);
  return router.currentRoute.value.path == "/pos/pos";
});

const isInHome = computed(() => {
  return router.currentRoute.value.path == "/pos/home";
});
</script>

<style scoped>
.drag {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
</style>
