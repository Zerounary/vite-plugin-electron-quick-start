<template>
  <div class="flex space-x-2 cursor-pointer">
    <div class="box" @click="click('today')" :class="isActive('today')">今日</div>
    <div class="box" @click="click('week')" :class="isActive('week')">本月</div>
    <div class="box" @click="click('month')" :class="isActive('month')">本月</div>
    <div class="box" @click="click('year')" :class="isActive('year')">本年</div>
  </div>
</template>

<script setup lang="ts">
import { useDateStore } from "../stores/date";
const dateStore = useDateStore();
const isActive = dateStore.isAcitve;

const click = (tag) => {
  dateStore.$patch({
    tag
  });
};

</script>

<style scoped>
.box {
  @apply px-3 py-1 border rounded-sm bg-white;
}
.active {
  @apply bg-blue-500 text-white;
}
</style>
