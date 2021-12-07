import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import {router, RouterMount} from './router.js'  //路径换成自己的
Vue.use(router)

/**
* 引入uView主JS库
* */
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
// #endif

// #ifndef VUE3 || APP-PLUS || APP-PLUS-NVUE || MP || QUICKAPP-WEBVIEW || QUICKAPP-WEBVIEW-UNION || QUICKAPP-WEBVIEW-HUAWEI
RouterMount(app,router,'#app')
// #endif

// #ifndef VUE3 || H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif


// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif