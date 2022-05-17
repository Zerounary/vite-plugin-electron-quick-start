<template>
  <div class="drag grid grid-cols-2 items-center h-50px shadow bg-white px-3">
    <div class=" text-left flex items-center">
      <Icon icon="material-symbols:store-outline" width="24" height="24" />
      <div>门店管理</div>
    </div>
    <div class=" flex items-center justify-end">
      <Icon icon="bxs:user" width="24" height="24" />
      <div>系统管理员</div>
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
import { rendererSend } from '~/electron-main/common/ipcRender'
import ipcNames from '~/electron-main/common/ipcNames';

let quit = () => {
  rendererSend(ipcNames.quit, null)
}
</script>

<style scoped>
.drag {
   -webkit-app-region: drag;
}
.no-drag {
   -webkit-app-region: no-drag;
}
</style>
