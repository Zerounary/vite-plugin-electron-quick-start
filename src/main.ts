import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
console.log("🚀 ~ file: main.ts ~ line 8 ~ routes", routes)

let app = createApp(App);

app.use(createPinia());

let router = createRouter({
  history: createWebHistory(),
  routes,
});
app.use(router)

global.router = router;

app.mount('#app')
  .$nextTick(window.removeLoading)
