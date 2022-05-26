<template>
  <div class="px-3 space-y-3 text-13px">
    <div class="box space-x-3 w-full flex items-center bg-white shadow rounded">
      <input placeholder="请输入会员卡号或者手机号" v-model="vipKeyWord" />
      <button class="btn" @click="query">查询</button>
      <button class="btn" @click="openVipDialog">新增VIP</button>
      <div class="circle !ml-24"></div>
      <div>{{ mobil }}</div>
      <div>白金卡</div>
      <div>券：{{tickets}}</div>
      <div>积分：{{integral}}</div>
      <div>储值：{{amount}}</div>
    </div>
    <div
      class="flex space-x-3 h-[calc(100vh-60px-0.75rem-80px-0.75rem-0.75rem)]"
    >
      <div
        class="flex-grow h-full flex flex-col divide-y bg-white rounded shadow"
      >
        <div class="flex-grow w-full p-5">
          <table class="w-full">
            <thead class="text-gray-600">
              <tr>
                <th>款号</th>
                <th>品名</th>
                <th>销售属性</th>
                <th>数量</th>
                <th>原价</th>
                <th>成交价</th>
                <th>折扣</th>
                <th>成交金额</th>
                <th>库存</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody class=" h-[calc(100vh-350px)] overflow-auto divide-y">
              <tr v-for="n in 100" :key="n">
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="box space-x-3">
          <input placeholder="请输入条码" />
          <button class="btn">查询</button>
        </div>
      </div>
      <div class="h-full overflow-auto flex flex-col bg-white rounded shadow space-y-3 px-5">
        <div class="grid grid-cols-3 gap-3 mt-10">
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>营业员</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>库存查询</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>开新单</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>原单退货</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>非原单退货</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>订单查询</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>挂单</div>
          </div>
        </div>
        <!-- 备注 -->
        <div class="!mt-10">
          <input class="!h-40px" placeholder="请输入备注" />
        </div>

        <div class="space-y-10 !mt-10 flex-grow">
          <div class="flex items-center">
            <div class="flex-grow text-16px">优惠券</div>
            <div class="w-120px text-right">
              <select>
                <option>优惠券XXXXXX</option>
              </select>
            </div>
          </div>

          <div class="flex items-center">
            <div class="flex-grow text-16px">积分</div>
            <div class="w-240px text-right">
              共1000积分，使用50积分，抵扣50.00元
            </div>
          </div>

          <div class="flex items-center">
            <div class="flex-grow text-16px">抹零</div>
            <div class="w-240px text-right">
              已优惠9元
              <select>
                <option>保留小数位</option>
              </select>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-center text-16px space-x-16 !mt-20"
        >
          <div class="flex flex-col items-center space-y-1">
            <div class="font-bold">2900.00</div>
            <div class="text-gray-500">商品总价</div>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="font-bold">2900.00</div>
            <div class="text-gray-500">商品总价</div>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="font-bold">2900.00</div>
            <div class="text-gray-500">商品总价</div>
          </div>
        </div>

        <div class="!mt-10 flex items-center space-x-5 py-5">
          <div class="flex-grow text-right space-y-2">
            <div>共5件商品</div>
            <div class="text-red-500">￥2400.00</div>
          </div>

          <button class="h-50px w-120px border rounded bg-blue-500 text-white">
            付款
          </button>
        </div>
      </div>
    </div>
  </div>
  <el-dialog class="no-drag" 
    v-model="vipDialogVisible"
  >
    会员新增弹窗
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from "vue"
import {useVipStore} from '@/stores/vip'

const vipDialogVisible = ref(false);

const openVipDialog = () => {
  vipDialogVisible.value = true;
}

const closeVipDialog = () => {
  vipDialogVisible.value = false;
}

const vipStore = useVipStore();

// 手机号
const mobil = computed(() => {
  return vipStore.vip?.mobil || '-';
});

// 会员类型
const vipType = computed(() => {
  return vipStore.vip?.vipType || '无';
});

// 积分
const integral = computed(() => {
  return vipStore.vip?.integral || 0;
});

// 储值
const amount = computed(() => {
  return vipStore.vip?.amount || 0;
});

// 优惠券
const tickets = computed(() => {
  return vipStore.vip?.tickets || 0;
});
let vipKeyWord = ref('');

let query = () => {
  vipStore.fetchVip(vipKeyWord.value);
}

</script>

<style scoped>
table thead,
table tbody {
  @apply w-full float-left;
}
table tr {
  @apply h-40px w-full table text-left;
}
table th,
table td {
  width: 10%;
}
.box {
  @apply h-80px px-5 py-5;
}

input {
  @apply border h-full rounded px-2 w-240px;
}
.btn {
  @apply w-80px border px-2 h-full rounded text-sm;
}
.circle {
  @apply w-8 h-8 rounded-full bg-gray-200;
}
.square {
  @apply w-80px h-80px rounded bg-gray-200;
}
</style>
