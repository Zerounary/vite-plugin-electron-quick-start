import router from "@/router";
import { request } from "@/util/request";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isLogin: false,
      user: null,
    };
  },
  actions: {
    async login(username, password) {
      this.user = await request.post("/api/loginUser", {
        username,
        password,
      });
      console.log(
        "🚀 ~ file: auth.ts ~ line 17 ~ login ~ this.user",
        this.user
      );
      if(this.user) {
        this.isLogin = true;
      }else {
        ElMessage.error("用户名或密码错误");
      }
    },
    async logout() {
      this.isLogin = false;
      await request.post("/api/logout");
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["isLogin", "user"],
      }
    ]
  }
});