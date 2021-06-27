import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/pages/home/index.vue';
const context = require.context('../pages/', true, /th-[\w.]+\.vue/);
const auto_router = [];
const mlInstall = () => {
  context.keys().forEach((key) => {
    const component = context(key).default;
    const fullPath = key.substring(2).split('/th-')[1];
    const path = fullPath.split('.vue')[0]
    const fullPathed = key.substring(2)
    auto_router.push({
      path: `/${path}`,
      name: path,
      component: () => import(/* webpackChunkName: "home[request]" */ `../pages/${fullPathed}`),
      meta: { requiresAuth: true },
    });
  });
};
mlInstall();
Vue.use(VueRouter);
const routes = auto_router.concat([
  {
    path: '/',
    name: '',
    component: Home,
    meta: { requiresAuth: true },
  },
])

const router = new VueRouter({
  mode: 'hash',
  // base: window.__POWERED_BY_QIANKUN__ ? '/moling/' : '/',
  base: '/',
  routes,
});

export default router;
