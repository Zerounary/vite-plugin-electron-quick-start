<template>
  <div class="flex items-center space-x-2 bg-white rounded shadow h-100px">
    <div class="box" v-for="cell in cells" :key="cell.title">
      <div class="font-bold text-16px text-gray-600 h-30px leading-30px">{{cell.title}}</div>
      <div class="text-red-500 font-bold h-20px leading-20px">{{toLocaleString(cell.value)}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {toLocaleString} from '@/util/format';

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
.box{
  @apply px-2 py-1 rounded bg-white text-center w-min-100px space-y-1;
}
</style>
