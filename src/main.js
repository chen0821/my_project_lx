import Vue from 'vue';
import App from './App.vue';
import router from './router';
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import store from './store';
import axios from 'axios';
import qs from 'qs';

import { Indicator } from 'mint-ui';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$eventBus = new Vue();
Vue.use(MintUI)

axios.defaults.baseURL = 'https://ele-interface.herokuapp.com/';

// # 1. 请求拦截器 
	axios.interceptors.request.use(function(config) {
      if(config.method=='post'){
        config.data=qs.stringify(config.data);
      }
      Indicator.open();//加载动画
      return config;
    }, function(err){
      return Promise.reject(err)
    })
	// #2. 响应拦截器 
    axios.interceptors.response.use(function(res) {
      Indicator.close();//关闭动画
      return res;
    }, function(err){
      Indicator.close();
      return Promise.reject(err)
    })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
