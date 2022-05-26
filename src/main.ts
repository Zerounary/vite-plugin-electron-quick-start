import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import router from "./router"

import './styles/base.css';
import 'virtual:windi.css';
import 'virtual:windi-devtools';

import ElementPlus from "element-plus"
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

let app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);

app.use(router)

global.router = router;

app.use(ElementPlus, {
  locale: zhCn
});

app.mount('#app')
  .$nextTick(window.removeLoading)
