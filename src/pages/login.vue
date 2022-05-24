<template>
  <div
    class="drag w-screen h-screen bg-hero-temple flex flex-col items-center justify-center relative space-y-10"
  >
    <h1>POS系统</h1>
    <div class="no-drag w-min-420px bg-white rounded-xl p-40px space-y-10">
      <h1>欢迎登录</h1>
      <form class="space-y-5">
        <div class="flex items-center relative">
          <Icon icon="ant-design:user-outlined" width="20" class="absolute ml-10px" />
          <input v-model="username" placeholder="输入账号" />
        </div>
        <div class="flex items-center relative">
          <Icon icon="bxs:lock-alt" width="20" class="absolute ml-10px" />
          <input v-model="password" type="password" placeholder="输入密码" />
        </div>
      </form>
      <button @click="login">登录</button>
    </div>
    <div class="fixed bottom-0 w-full h-30px text-center leading-30px text-xs">
      2015-2022 上海云欢网络科技有限公司 版权所有 www.cloudhappy.cn
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import { Icon } from "@iconify/vue";
import { useAuthStore } from '@/stores/auth';

let username = ref('')
let password = ref('')

const authStore = useAuthStore();

let login = () => {
  authStore.login(username.value, password.value);
}
</script>

<style scoped>
h1 {
  @apply text-2xl text-blue-600;
}
input {
  @apply border-b h-40px w-full text-sm p-3 px-40px;
}

button {
  @apply bg-blue-500 text-white px-4 py-2 rounded w-full h-40px;
}

</style>
