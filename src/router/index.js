import Vue from 'vue'
import Router from 'vue-router'

import Movies from '@/components/Movies'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/movies',
      name: 'Movies',
      component: Movies,
      meta: {
        requiresAuth: true
      }
    },
    // {
    //   path: '/movies/:name',
    //   name: 'Hello',
    //   component: Hello
    // }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('movies')
  else next()
})

export default router