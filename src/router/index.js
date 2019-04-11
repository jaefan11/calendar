import Router from 'vue-router'
import home from '@/components/home'
import bar from '@/components/bar.vue'
import calendar from '@/components/calendar.vue'
import activityController from'@/components/activity-controller.vue'
import eventCreate from '@/components/eventCreate/eventCreate.vue'
import head from '@/components/eventCreate/head.vue'
import bottom from '@/components/eventCreate/bottom.vue'
import login from '@/components/login.vue'
import store from '../store/store'


const router = new Router({
	routes: [
		{ path: '/', redirect: '/login' },
		{ path: '/login', name: 'login', component: login},
		{
			path: '/home',
			name: 'home',
			component: home,
			meta: {
				requireAuth: true,
			},
			children: [{
				path: '',
				components: {
					head: bar,
					left: calendar,
					contro: activityController,
				}
			}]
		},
		{
			path: '/create',
			component: eventCreate,
			name:'create',
			meta: {
				requireAuth: true,
			},
			children: [{
				path: '',
				components: {
					head: head,
					bottom: bottom
				}
			}]
		},
		
	]
})


// 页面刷新时，重新赋值token
// if (window.localStorage.getItem('token')) {
// 	console.log("retoken")
//     store.commit('login',JSON.parse(window.localStorage.getItem('user')), window.localStorage.getItem('token'))
// }

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
		console.log("登陆"+localStorage.token)
        if (store.state.token) {
			console.log("登陆....")
			store.dispatch('connect')
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
})

export default router