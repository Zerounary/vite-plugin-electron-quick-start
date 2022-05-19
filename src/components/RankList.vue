<template>
  <div class="w-min-350px bg-white h-400px p-5 rounded shadow space-y-3">
    <div class="font-bold">{{title}}</div>
    <table class="w-full">
      <thead class="w-full">
        <template v-for="head in heads" :key="head">
          <th class="text-gray-500 font-normal text-14px">
            {{head.label}}
          </th>
        </template>
      </thead>
      <tbody class=" text-13px text-black text-center">
        <template v-for="item in data" :key="item">
          <tr class="h-30px">
            <template v-for="head in heads" :key="head">
              <td>
                  {{toLocaleString(item[head.prop])}}
              </td>
            </template>     
          </tr>
        </template>
      </tbody>
    </table>
    <div class="text-center text-gray-500 text-13px " v-if="noData">
      没有数据
    </div>
    <div class="h-30px text-14px text-blue-500 font-bold text-center" v-if="!noData" >
      查看更多
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { toLocaleString } from "@/util/format";

interface Head {

}
interface Item {

}
interface Props {
  title: string
  heads: Head[]
  data: Item[]
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  heads: () => [],
  data: () => []
})

const noData = computed(() => {
  return props.data.length === 0
})

</script>

<style scoped>

</style>