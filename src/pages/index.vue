<template>
  <div class="space-y-3">
    <StoreHeader />
    <div class="center">
      <DateNav class="" />
    </div>

    <div class="center">
      <ObjectGrid :value="grid" />
    </div>

    <div class="columns-3">
      <RankList title="商品销售排行" :heads="heads" :data="data" />
      <RankList title="导购业绩" />
      <RankList title="会员销售排行" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StoreHeader from "../components/StoreHeader.vue";
import DateNav from "../components/DateNav.vue";
import ObjectGrid from "../components/ObjectGrid.vue";
import RankList from "../components/RankList.vue";

const grid = {
  零售额: 2819,
  销售指标: 2819,
  达成率: "20%",
  零售数量: 2819,
  退货数量: 2819,
  退货率: "10%",
  客单价: 100,
  连带率: 2.3,
  会销率: "89%",
  新增会员: 2819,
};

const heads = [
  {
    label: "商品",
    prop: "name",
  },
  {
    label: "商品",
    prop: "dayAvgQty",
  },
  {
    label: "可用库存",
    prop: "storageQty",
  },
  {
    label: "可售天数",
    prop: "saleDay",
  },
];

let item = {
  name: "商品1",
  dayAvgQty: 2819,
  storageQty: 2819,
  saleDay: 28,
};
const data = [];

for (let i = 0; i < 4; i++) {
  data.push(item);
}
</script>

<style scoped>
.center {
  @apply w-full flex justify-center;
}
</style>
