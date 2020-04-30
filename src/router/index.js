import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/pages/Hello';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Video from '@/pages/Video';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/video',
      name: 'Video',
      component: Video,
    },
  ],
});
