<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from "../stores/app"
// import { storeToRefs } from "pinia"
import { rendererSend } from '~/electron-main/common/ipcRender'
import ipcNames from '~/electron-main/common/ipcNames';

defineProps<{ msg: string }>()

const counterStore =  useAppStore();

let quit = () => {
  rendererSend(ipcNames.quit, null)
}

</script>

<template>
  <h1>{{ msg }}</h1>

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

  <button type="button" @click="counterStore.increment()">count is: {{ counterStore.count }}</button>
  <button type="button" @click="quit">quit</button>
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
