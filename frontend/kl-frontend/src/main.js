import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

App.use(router);

createApp(App).mount('#app')
