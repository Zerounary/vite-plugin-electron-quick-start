<template>
  <div class="w-min-300px bg-white h-400px p-3 rounded shadow space-y-3">
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
                  {{item[head.prop]}}
              </td>
            </template>     
          </tr>
        </template>
      </tbody>
    </table>
    <div class="h-30px text-14px text-blue-500 font-bold text-center">
      查看更多
    </div>
  </div>
</template>

<script setup lang="ts">
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

</script>

<style scoped>

</style>