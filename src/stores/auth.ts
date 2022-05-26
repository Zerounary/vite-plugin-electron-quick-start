import router from "@/router";
import { request } from "@/util/request";
import { getStore } from "@/util/storage";
import { defineStore } from "pinia";

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
      this.isLogin = true;
      router.push("/pos/home");
    },
    async logout() {
      await request.post("/api/logout");
      this.isLogin = false;
      router.push("/login");
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["isLogin"],
      }
    ]
  }
});