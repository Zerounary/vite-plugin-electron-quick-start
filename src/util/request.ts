// import { ipcNames } from '~/electron-main/common/ipcNames';
import Axios from "axios";
// import { mainSend } from '~/electron-main/common/ipcMain';

Axios.defaults.adapter = require("axios/lib/adapters/http");

export const request = Axios.create({
  baseURL: 'http://localhost:8079/',
  timeout: 30000
});


request.interceptors.response.use(
   function (response) {
      // 对响应数据做点什么
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