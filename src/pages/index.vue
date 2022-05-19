<template>
  <div class="px-3 space-y-3">
    <div
      class="space-x-3 text-xs h-80px w-full flex items-center px-3 py-5 bg-white shadow rounded"
    >
      <input
        class="border h-full rounded px-2 w-240px"
        placeholder="请输入会员卡号或者手机号"
      />
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
        <div class="h-80px"></div>
      </div>
      <div class="h-full bg-white rounded shadow"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.btn {
  @apply w-80px border px-2 h-full rounded text-sm;
}
.circle {
  @apply w-8 h-8 rounded-full bg-gray-200;
}
</style>
