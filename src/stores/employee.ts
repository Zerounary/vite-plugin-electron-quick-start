import { defineStore } from "pinia";
import { useApi } from "./api";
import { useAuthStore } from "./auth";
import { useDateStore } from './date';

export const useEmployeeStore = defineStore("employee", {
  state: () => {
    return {
      rank: [],
      employee: []
    };
  },
  actions: {
    async fetchEmployeeRank() {
      const auth = useAuthStore();
      const date = useDateStore();
      const api = useApi();
      let res = await api.noPage("pos/employee_rank", {
        storeId: auth.user.storeId,
        billdate: date.getDateRange
      });
      this.rank = res;
      return res;
    },
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
