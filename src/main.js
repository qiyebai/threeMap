import Vue from 'vue';
import ViewDesign from 'view-design';
import 'view-design/dist/styles/iview.css';

import App from './App.vue';
import router from './router';
import store from './store';
import './theme/rootStyle.less';
import './theme/skin.default.less';

Vue.config.productionTip = false;
Vue.use(ViewDesign);

const isDev = process.env.NODE_ENV === 'development';

Vue.config.errorHandler = function (err, vm, info) {
  if (isDev) {
    console.groupCollapsed('vue errorHandler');
    console.log('err:==', err);
    console.log('vm:==', vm);
    console.log('info:==', info);
    console.groupEnd();
  }
};

Vue.config.warnHandler = function (msg, vm, trace) {
  if (isDev) {
    console.groupCollapsed('vue warnHandler');
    console.log('msg:==', msg);
    console.log('vm:==', vm);
    console.log('trace:==', trace);
    console.groupEnd();
  }
};
window.addEventListener(
  'error',
  function (err) {
    if (isDev) {
      console.groupCollapsed('window global uncaught error');
      console.log('err:==', err);
      console.groupEnd();
    }
  },
  true,
);

window.addEventListener(
  'unhandledrejection',
  function (event) {
    // 尽管能抓到全局未处理的 promise rejection 错误，但是控制台仍旧会打印错误
    // 需要如下阻止浏览器默认行为可防止控制台飘红
    // stopPropagation 及 stopImmediatePropagation 都无效
    event.preventDefault();
    if (isDev) {
      console.groupCollapsed('window unhandledrejection');
      console.log('err:==', event.reason);
      console.groupEnd();
    }
  },
  true,
);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
