<template>
  <div class="px-3 space-y-3 text-13px">
    <div class="box space-x-3 w-full flex items-center bg-white shadow rounded">
      <input placeholder="请输入会员卡号或者手机号" />
      <button class="btn">查询</button>
      <button class="btn">新增VIP</button>
      <div class="circle !ml-24"></div>
      <div>158****8833</div>
      <div>白金卡</div>
      <div>券：2</div>
      <div>积分：2</div>
      <div>储值：2</div>
    </div>
    <div
      class="grid grid-cols-3 gap-3 h-[calc(100vh-60px-0.75rem-80px-0.75rem-0.75rem)]"
    >
      <div
        class="col-span-2 h-full flex flex-col divide-y bg-white rounded shadow"
      >
        <div class="flex-grow"></div>
        <div class="box space-x-3">
          <input placeholder="请输入条码" />
          <button class="btn">查询</button>
        </div>
      </div>
      <div class="h-full flex flex-col bg-white rounded shadow space-y-3 px-5">
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
        <div class="box">
          <input placeholder="请输入备注" />
        </div>

        <div class="space-y-10 !mt-20 flex-grow">
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
          class="flex items-center justify-center text-16px space-x-5 !mt-20"
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

          <button class="h-50px w-120px border rounded bg-blue-500 text-white">付款</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.box {
  @apply h-80px px-2 py-5;
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
