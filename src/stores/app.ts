import { description, version } from "~/package.json";
import { defineStore } from "pinia";

export const useAppStore = defineStore("counter", {
  state: () => {
    return {
      count: 0,
      version: {
        now: version,
        newVersion: null,
        showModal: false,
        isError: false,
        isTimeOut: false,
        isUnknow: false,
        isDownloaded: false,
        isDownloading: false,
        isLatestVer: false,
        downloadProgress: null,
        error: null,
      },
    };
  },
  getters: {
    getUpdateStatus(state) {
      if (state.version.isDownloading) {
        if (state.version.isDownloaded) {
          return "点击更新";
        } else if (state.version.isError) {
          return state.version.error || '更新失败';
        } else if (state.version.downloadProgress) {
          return state.version.downloadProgress.percent.toFixed(2) + "%";
        } else {
          return "发现新版本，正在请求更新...";
        }
      } else {
        return `v${state.version.now}`;
      }
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
