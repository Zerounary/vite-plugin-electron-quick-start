<template>
  <div class="space-y-3">
    <StoreHeader />
    <div class="w-full flex justify-center">
      <DateNav />
    </div>
    <ObjectGrid :value="grid" />
  </div>
</template>

<script setup lang="ts">
import StoreHeader from "../components/StoreHeader.vue";
import DateNav from "../components/DateNav.vue";
import ObjectGrid from "../components/ObjectGrid.vue";

const grid = {
  '零售额': 2819,
  '销售指标': 2819,
  '达成率': '20%',
  '零售数量': 2819,
  '退货数量': 2819,
  '退货率': '10%',
  '客单价': 100,
  '连带率': 2.3,
  '会销率': '89%',
  '新增会员': 2819,

}
</script>

<style scoped></style>
