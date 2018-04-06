import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'report',
      component: require('@/components/ReportForm').default
    },
    {
      path: '/my-time-entries',
      name: 'my-time-entries',
      component: require('@/components/MyTimeEntries').default
    },
    {
      path: '/my-tasks',
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
