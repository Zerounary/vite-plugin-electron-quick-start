<script setup lang="ts">
// starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import ipcNames from "../electron-main/common/ipcNames";
import { rendererOn } from "../electron-main/common/ipcRender";
import { useAppStore } from "./stores/app";

let appStore = useAppStore();
rendererOn(ipcNames.update_available, (e, info) => {
  appStore.$patch({
    version: {
      isDownloading: true,
      newVersion: info,
    },
  });
});

rendererOn(ipcNames.update_error, () => {
  appStore.$patch({
    version: {
      isError: true,
    },
  });
});

rendererOn(ipcNames.update_progress, (event, progress) => {
  appStore.$patch({
    version: {
      downloadProgress: Object.assign({}, progress), // 复制，避免不更新
    },
  });
});

rendererOn(ipcNames.update_downloaded, () => {
  // console.log(info)
  appStore.$patch({
    version: {
      isDownloaded: true,
    },
  });
});

rendererOn(ipcNames.update_not_available, (event, info) => {
  appStore.$patch({
    version: {
      isLatestVer: true,
      newVersion: info,
    },
  });
});
</script>

<template>
  <div class="space-y-3">
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  //margin-top: 24px;
  width: 100%;
}
</style>
