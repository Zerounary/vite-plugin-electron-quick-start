// import { ipcNames } from '~/electron-main/common/ipcNames';
import Axios from "axios";
import { ElMessage } from "element-plus";
// import { mainSend } from '~/electron-main/common/ipcMain';

Axios.defaults.adapter = require("axios/lib/adapters/http");
Axios.defaults.withCredentials = true;

export const request = Axios.create({
  baseURL: 'http://localhost:8079/',
  timeout: 30000,
});

let Cookie =  localStorage.getItem("cookie") || "";

request.interceptors.request.use(
  function(config) {
    console.debug("request ===> ", config)
    // Do something before request is sent
    if(config.url != "/api/loginUser") {
      config.headers.Cookie = Cookie;
    }
    return config;
  }
)

request.interceptors.response.use(
   function (response) {
      console.debug("response <=== ", response)
      // 对响应数据做点什么
      if(response.headers?.["set-cookie"]){
        Cookie = response.headers["set-cookie"].join("; ")
        localStorage.setItem("cookie", Cookie)
      }
      if(response.status != 200) {
        ElMessage.error(response.data?.message || response.statusText);
      }
      if(response.data?.code == 401){
        ElMessage.warning("登录已超时，请重新登录!");
        router.push('/login');
      }
      if(response.data?.code == 2){
        ElMessage.warning(response.data?.msg);
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