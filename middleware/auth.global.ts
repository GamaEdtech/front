// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  // Ensure auth state is loaded before checking
  await auth.loadUserFromCookie()

  const protectedRoutes = ['/dashboard', '/user']

  const shouldProtect = protectedRoutes.some((route) =>
    to.path.startsWith(route)
  )

  if (shouldProtect && !auth.isAuthenticated.value) {
    return navigateTo('/') // redirect to login if not authenticated
  }
})