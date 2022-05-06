import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

import { createPinia } from 'pinia'


let app = createApp(App);

app.use(createPinia());

app.mount('#app')
  .$nextTick(window.removeLoading)
