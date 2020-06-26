// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVue from 'bootstrap-vue';

import Vue from 'vue';
import Vuetify from 'vuetify';
import VueSwal from 'vue-swal';
import VueFileAgent from 'vue-file-agent';
import VueCarousel from 'vue-carousel';
import VueFileAgentStyles from 'vue-file-agent/dist/vue-file-agent.css';
import Button from '@/components/Button';
import Navbar from '@/components/Navbar';
import InputComponent from '@/components/InputComponent';
import App from '@/App';
import { store } from './store/store';
import router from '@/router';

Vue.use(BootstrapVue);
Vue.use(VueFileAgent);
Vue.use(VueCarousel);
Vue.use(Vuetify);
Vue.use(VueSwal);

Vue.component('btn', Button);
Vue.component('Navbar', Navbar);
Vue.component('Input', InputComponent);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  vuetify: new Vuetify(),
  components: { App },
  template: '<App/>',
});
