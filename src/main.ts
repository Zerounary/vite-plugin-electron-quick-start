import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

import { createPinia } from 'pinia'
import router from "./router"

import './styles/base.css';
import 'virtual:windi.css';
import 'virtual:windi-devtools';

import ElementPlus from "element-plus"
import 'element-plus/dist/index.css'

let app = createApp(App);

app.use(createPinia());

app.use(router)

global.router = router;

app.use(ElementPlus);

app.mount('#app')
  .$nextTick(window.removeLoading)
