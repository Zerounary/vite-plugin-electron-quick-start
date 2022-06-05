<template>
  <div>
    <router-link to="/pos/home">/pos/home</router-link>
    <button @click="insertIt">插入</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { insert_m_dimdef } from "~/electron-main/common/db";

const id = ref(0);

const insertIt = () => {
  console.log("insertIt");

  insert_m_dimdef.run({
    id: id.value++,
    name: "yes",
    description: "ok",
    dimflag: "DIM1",
    creationdate: null,
    modifieddate: null,
  });
};
</script>

<style scoped></style>
