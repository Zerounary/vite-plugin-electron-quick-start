<template>
  <div>
    <div>
      开机启动：
      <el-switch
        :value="appStore.launchStatus"
        @change="changeLaunchStatus"
        size="large"
        active-text="开启"
        inactive-text="关闭"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import ipcNames from "~/electron-main/common/ipcNames";
import { rendererSend } from "~/electron-main/common/ipcRender";

const appStore = useAppStore();

const changeLaunchStatus = () => {
  if (appStore.launchStatus) {
    rendererSend(ipcNames.auto_launch_disable, null);
  } else {
    rendererSend(ipcNames.auto_launch_enable, null);
  }
};
</script>

<style scoped></style>
