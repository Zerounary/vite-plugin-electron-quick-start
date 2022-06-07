<template>
  <div class="space-y-3">
    <div class="w-1200px m-auto flex flex-col items-center space-y-3">
      <DateNav />
      <ObjectGrid :heads="gridHeads" :value="retailStore.homeGrid" />
      <div class="w-full flex space-x-8 ">
        <RankList title="商品销售排行" :heads="productHeads" :data="productStore.rank" />
        <RankList title="导购业绩" :heads="employeeHeads" :data="employeeStore.rank" />
        <RankList title="会员销售排行" :heads="vipHeads" :data="vipStore.rank" />
      </div>
      <div
        ref="retailChart"
        class="w-1200px h-500px mt-10 m-auto shadow p-5 border bg-white rounded"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import DateNav from "@/components/DateNav.vue";
import ObjectGrid from "@/components/ObjectGrid.vue";
import RankList from "@/components/RankList.vue";

import * as echarts from "echarts";
import { useProductStore } from "@/stores/product";
import { useDateStore } from "@/stores/date";
import { useEmployeeStore } from "@/stores/employee";
import { useVipStore } from "@/stores/vip";
import { useRetailStore } from "@/stores/retail";

const dateStore = useDateStore();
const productStore = useProductStore();
const employeeStore = useEmployeeStore();
const vipStore = useVipStore();
const retailStore = useRetailStore();

const retailChart = ref<HTMLElement>();

async function flushHomeChart() {
  await retailStore.fetchRetailChart();
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
      data: (retailStore.homeChart || []).map((item) => item['日期']),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "销售额",
        type: "line",
        data: (retailStore.homeChart || []).map((item) => item['金额']),
      },
    ],
  });
  chart.resize();
}

dateStore.$subscribe(async (mutation, state) => {
  productStore.fetchProductRank();
  employeeStore.fetchEmployeeRank();
  vipStore.fetchVipRank();
  retailStore.fetchHomeGrid();
  flushHomeChart();
});

onMounted(async () => {
  await productStore.fetchProductRank();
  await employeeStore.fetchEmployeeRank();
  await vipStore.fetchVipRank();
  await retailStore.fetchHomeGrid();
  flushHomeChart();
});

const gridHeads = ['零售额', '销售指标', '达成率', '零售数量', '退货数量', '退货率', '客单价', '连带率', '会销率','新增会员'];

const productHeads = [
  {
    label: "商品",
    prop: "name",
  },
  {
    label: "日均销量",
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

const employeeHeads = [
  {
    label: "导购",
    prop: "name",
  },
  {
    label: "单数",
    prop: "billsnum",
  },
  {
    label: "业绩",
    prop: "amt",
  },
  {
    label: "数量",
    prop: "qty",
  },
  {
    label: "开卡",
    prop: "vip",
  },
];

const vipHeads = [
  {
    label: "会员卡号",
    prop: "cardno",
  },
  {
    label: "会员卡",
    prop: "vipType",
  },
  {
    label: "数量",
    prop: "qty",
  },
  {
    label: "金额",
    prop: "amt",
  },
  // {
  //   label: "操作",
  //   prop: "saleDay",
  // },
]

</script>

<style scoped>
.center {
  @apply w-full flex justify-center;
}
</style>
