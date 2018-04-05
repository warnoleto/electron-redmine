import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'my-tasks',
      component: require('@/components/MyTasks').default
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
