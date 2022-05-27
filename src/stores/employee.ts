import { defineStore } from "pinia";
import { request } from "@/util/request";
import { useApi } from "./api";
import { useAuthStore } from "./auth";

export const useEmployeeStore = defineStore("employee", {
  state: () => {
    return {
      employee: []
    };
  },
  actions: {
    async fetchAllEmployee(filter?) {
      const api = useApi();
      const auth = useAuthStore();
      this.employee = await api.noPage("employee", {
        storeId: auth.user.storeId,
        ...filter
      });
    },
  },
});
