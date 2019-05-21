import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/www',
      name: 'landing-page',
      component: require('@/components/HomePage').default
    },
    {
      path: '/',
      name: 'search-emotion',
      component: require('@/components/SearchEmotion').default
    },
    {
      path: '/help',
      name: 'help-page',
      component: require('@/components/HelpPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
