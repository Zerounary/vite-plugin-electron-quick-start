<script setup lang="ts">
// starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import ipcNames from "~/electron-main/common/ipcNames";
import { rendererSend } from "~/electron-main/common/ipcRender";
import { rendererOn } from "~/electron-main/common/ipcRender";
import { useAppStore } from "@/stores/app";
import { Icon } from "@iconify/vue";

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
const minus = () => {
  rendererSend(ipcNames.minimize, null);
};
const maximize = () => {
  rendererSend(ipcNames.maximize, null);
};
const quit = () => {
  rendererSend(ipcNames.quit, null);
};
</script>

<template>
  <div class="w-100vw h-30px bg-hex-3b3b3b flex items-center justify-end drag">
    <div class="no-drag px-1 flex items-center space-x-2">
      <Icon
        class="cursor-pointer"
        icon="mdi:minus"
        color="#bfbfbf"
        width="24"
        @click="minus"
      />
      <Icon
        class="cursor-pointer"
        icon="fluent:maximize-16-regular"
        color="#bfbfbf"
        width="24"
        @click="maximize"
      />
      <Icon
        class="cursor-pointer"
        icon="mdi:window-close"
        color="#bfbfbf"
        width="24"
        @click="quit"
      />
    </div>
  </div>
  <div class="h-[calc(100vh-30px)] overflow-y-auto">
    <img height="124" :src="'./logo.svg'" />
    <span>{{ appStore.getUpdateStatus }}</span>
    <span>{{ appStore.version }}</span>
    <p class="text-indigo-500">
      <router-link to="/"
        ><Icon icon="ant-design:home-outlined" />Home</router-link
      >
      |
      <router-link to="/about"
        ><Icon icon="flat-color-icons:about" />About</router-link
      >
    </p>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
