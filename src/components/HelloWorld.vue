<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/app";
import { useKoaStore } from "../stores/koa";
import { useApi } from "@/stores/api";
// import { storeToRefs } from "pinia"
import { rendererSend } from "~/electron-main/common/ipcRender";
import ipcNames from "~/electron-main/common/ipcNames";

import { binPath, staticPath } from "@/utils/path";

defineProps<{ msg: string }>();

const counterStore = useAppStore();
const api = useApi();
const koaStore = useKoaStore();

let startServer = () => {
  if (koaStore.isStarted) {
    koaStore.stop();
  } else {
    koaStore.start();
  }
};

let serverStatus = computed(() => {
  return (!koaStore.isStarted ? "Start" : "Stop") + " Koa";
});

api.test();


let quit = () => {
  rendererSend(ipcNames.quit, null);
};
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>binPath: '{{ binPath }}' staticPath: '{{ staticPath }}'</p>
  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <el-button type="primary" @click="counterStore.increment()"
    >count is: {{ counterStore.count }}</el-button
  >
  <el-button @click="startServer">{{ serverStatus }}</el-button>
  <el-button type="danger" @click="quit">quit</el-button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
