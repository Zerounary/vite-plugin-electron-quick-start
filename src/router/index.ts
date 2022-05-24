import { useAuthStore } from "./../stores/auth";
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "~pages";

let router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  if (authStore.isLogin) {
    return true;
  } else {
    if (to.path === "/login") {
      return true;
    } else {
      router.push("/login");
    }
  }
});

export default router;
