// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
// import BootstrapVue from 'bootstrap-vue'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import FullCalendar from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './mock/mock.js'

import vueFullCalendar from 'vue-full-calendar';
import store from './store/store'


Vue.use(vueFullCalendar)
Vue.prototype.$http = axios
Vue.use(VueAxios, axios)
Vue.use(FullCalendar)
Vue.use(VCalendar)
Vue.use(ElementUI)
Vue.config.productionTip = false
// Vue.use(BootstrapVue)
Vue.use(Router)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
