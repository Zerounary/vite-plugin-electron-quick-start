<template>
  <div class="flex space-x-2">
    <div class="box" v-for="cell in cells" :key="cell.title">
      <div class="font-bold text-16px h-30px leading-30px">{{cell.title}}</div>
      <div class="text-red-500 h-20px leading-20px">{{cell.value}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
});

let cells = computed(() => {
  let data = []
  for(let key in props.value){
    data.push({
      title: key,
      value: props.value[key],
    })
  }
  return data
});
</script>

<style scoped>
.box {
  @apply
    px-2 py-1 border rounded bg-white text-center shadow w-min-100px space-y-1
}
</style>
