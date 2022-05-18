<template>
  <div class="space-y-3">
    <StoreHeader />
    <div class="m-auto space-y-3">
      <div class="center">
        <DateNav class="" />
      </div>

      <div class="center">
        <ObjectGrid :value="grid" />
      </div>
      <div class="center">
        <div class="flex space-x-8">
          <RankList title="商品销售排行" :heads="heads" :data="data" />
          <RankList title="导购业绩" />
          <RankList title="会员销售排行" />
        </div>
      </div>
      <div
        ref="retailChart"
        class="w-1200px h-500px mt-10 m-auto shadow p-5 border bg-white rounded"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import StoreHeader from "../components/StoreHeader.vue";
import DateNav from "../components/DateNav.vue";
import ObjectGrid from "../components/ObjectGrid.vue";
import RankList from "../components/RankList.vue";

import * as echarts from "echarts";

const retailChart = ref<HTMLElement>();

onMounted(() => {
  const chart = echarts.init(retailChart.value);
  chart.setOption({
    title: {
      text: "销售额走势",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["销售额"],
    },
    xAxis: {
      type: "category",
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "销售额",
        type: "line",
        data: [
          1000, 2000, 3600, 1400, 2800, 3200, 3600, 4500, 5500, 6500, 7500,
          8500,
        ],
      },
    ],
  });
  chart.resize();
});

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
</style>
