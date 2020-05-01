// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVue from 'bootstrap-vue';

import Vue from 'vue';
import Vuetify from 'vuetify';
import VueSwal from 'vue-swal';
import Button from '@/components/Button';
import Navbar from '@/components/Navbar';
import App from '@/App';
import { store } from './store/store';
import router from '@/router';

Vue.use(BootstrapVue);
Vue.use(Vuetify, {
	inconfont: 'md',
	theme: {
		primary: 'ffffff',
		success: '#3cd1c2',
		info: '#ffaa2c',
		error: '#f83e70',
	}
});
Vue.use(VueSwal);

Vue.component('btn', Button);
Vue.component('Navbar', Navbar);

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
