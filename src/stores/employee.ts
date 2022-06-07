import { defineStore } from "pinia";
import { db } from "~/electron-main/common/db";
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
      let employee = db.prepare(`SELECT * FROM hr_employee`).all();
      this.employee = employee;
    },
  },
});
