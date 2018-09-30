import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Menu from './views/Menu.vue'
import GameScene from './views/GameScene.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'menu',
      component: Menu
    },
    {
      path: '/newgame',
      name: 'newgame',
      component: () => import(/* webpackChunkName: "newgame" */ './views/NewGame.vue')
    },
    {
      path: '/gameover/:reason',
      name: 'gameover',
      component: () => import(/* webpackChunkName: "gameover" */ './views/GameOver.vue')
    },
    {
      path: '/credits',
      name: 'credits',
      component: () => import(/* webpackChunkName: "credits" */ './views/Credits.vue')
    },
    {
      path: '/score',
      name: 'final-score',
      component: () => import(/* webpackChunkName: "final-score" */ './views/FinalScore.vue')
    },
    {
      path: '/game',
      component: GameScene,
      children: [
        {
          path: '/',
          name: "home",
          component: Home
        },
        {
          path: '/stock',
          name: 'stock',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "stock" */ './views/Stock.vue')
        },
        {
          path: '/squads',
          name: 'squads',
          component: () => import(/* webpackChunkName: "squads" */ './views/Squads.vue')
        },
        {
          path: '/messages',
          name: 'messages',
          component: () => import(/* webpackChunkName: "messages" */ './views/Messages.vue')
        },
        {
          path: '/mission/:indexSquad',
          name: 'mission',
          component: () => import(/* webpackChunkName: "mission" */ './views/Mission.vue')
        },
        {
          path: '/mission-resume/:indexSquad',
          name: 'mission-resume',
          component: () => import(/* webpackChunkName: "mission-resume" */ './views/MissionResume.vue')
        },
        {
          path: '/scientifics',
          name: 'scientifics',
          component: () => import(/* webpackChunkName: "scientifics" */ './views/Scientifics.vue')
        },
        {
          path: '/project/:indexScientific',
          name: 'project',
          component: () => import(/* webpackChunkName: "project" */ './views/Project.vue')
        },
        {
          path: '/project-resume/:indexScientific',
          name: 'project-resume',
          component: () => import(/* webpackChunkName: "project-resume" */ './views/ProjectResume.vue')
        },
      ]
    },
  ]
})
