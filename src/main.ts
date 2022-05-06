import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from "./router"

let app = createApp(App);

app.use(createPinia());


let router = createRouter({
  history: createWebHashHistory(),
  routes
});
app.use(router)

global.router = router;

app.mount('#app')
  .$nextTick(window.removeLoading)
