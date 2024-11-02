/*
 * @Description: 
 * @Author: duqings duqings@foxmail.com
 * @Date: 2024-07-05 14:46:58
 * @LastEditors: duqings duqings@foxmail.com
 * @LastEditTime: 2024-07-05 14:55:20
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('hash'),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('@/views/Home.vue')
    }
  ]
})

export default router
