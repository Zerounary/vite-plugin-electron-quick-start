import log from "electron-log"
import { defineStore } from "pinia";
import { app } from "@/server";
import enableDestroy from "server-destroy"

let server = null;

export const useKoaStore = defineStore("koa", {
  state: () => {
    return {
      port: 3001,
      isStarted: false,
    }
  },
  actions: {
    start() {
      server = app.listen(this.port)
      enableDestroy(server);
      this.isStarted = true;
      log.info("Server started!")
    },
    stop() {
      server.destroy();
      this.isStarted = false;
      log.info("Server stoped!")
    }
  }
})