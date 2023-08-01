import { createRouter, createWebHistory } from 'vue-router'
// createRouter 创建路由实例，===> new VueRouter()
// 1. history模式: createWebHistory()   http://xxx/user
// 2. hash模式: createWebHashHistory()  http://xxx/#/user
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), //
  routes: [
    {
      path: '/login', //登录页路由
      name: 'login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/', //进入主框架
      name: 'layout',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

export default router
