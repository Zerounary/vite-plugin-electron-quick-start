import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist';
import { createRouter, createWebHashHistory } from 'vue-router'
// import routes from "./router"
import routes from '~pages'

import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'

import ElementPlus from "element-plus"
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

let app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist)
app.use(pinia);


let router = createRouter({
  history: createWebHashHistory(),
  routes
});
app.use(router)

global.router = router;

app.use(ElementPlus, {
  locale: zhCn
});

app.mount('#app')
  .$nextTick(window.removeLoading)
