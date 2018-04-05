import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'authentication',
      component: require('@/components/Authentication').default
    },
    {
      path: '/config',
      name: 'config',
      component: require('@/components/Configuration').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
