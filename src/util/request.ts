// import { ipcNames } from '~/electron-main/common/ipcNames';
import Axios from "axios";
// import { mainSend } from '~/electron-main/common/ipcMain';

Axios.defaults.adapter = require("axios/lib/adapters/http");
Axios.defaults.withCredentials = true;

export const request = Axios.create({
  baseURL: 'http://localhost:8079/',
  timeout: 30000,
});

let Cookie = []

request.interceptors.request.use(
  function(config) {
    console.log("🚀 ~ file: request.ts ~ line 14 ~ config", config)
    // Do something before request is sent
    config.headers.Cookie = Cookie.join('; ');
    return config;
  }
)

request.interceptors.response.use(
   function (response) {
      // 对响应数据做点什么
      console.log("🚀 ~ file: request.ts ~ line 30 ~ response", response)
      if(response.headers?.["set-cookie"]){
        Cookie = response.headers["set-cookie"]
      }
      return response.data;
    },
    function (error) {
      // 对响应错误做点什么
      // mainSend(global.modules.mainWindow, ipcNames.show_message, {
      //   type: "error",
      //   message: "出错了：" + error,
      // });
      return Promise.reject(error);
    }
)