// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAutha } from '../composables/useAutha'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, loadUserFromCookie } = useAutha()

  // Load token on page refresh
  loadUserFromCookie()

  // Only protect certain routes (like all under /user)
  const protectedRoutes = ['/dashboard', '/user']

  const shouldProtect = protectedRoutes.some((route) =>
    to.path.startsWith(route)
  )

  if (shouldProtect && !isAuthenticated.value) {
    return navigateTo('/') // or your actual login path
  }
})