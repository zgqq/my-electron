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
      path: '/search-emotion',
      name: 'search-emotion',
      component: require('@/components/SearchEmotion').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
