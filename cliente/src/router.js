import Vue from 'vue';
import Router from 'vue-router';
import Setting from './views/Setting.vue';
import Running from './views/Running.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'setting',
      component: Setting,
    },
    {
      path: '/running',
      name: 'running',
      component: Running,
    },
  ],
});
