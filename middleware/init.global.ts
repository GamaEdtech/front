import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { userInfo } from "@/services/userService";

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip initialization for public routes
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  const authToken = useCookie("authToken");

  // If no token is present and trying to access a protected route, redirect to login
  if (!authToken.value && to.path.startsWith("/user")) {
    console.log("No auth token found, redirecting to login");
    return navigateTo("/login");
  }

  // Init user data if token exists
  if (authToken.value) {
    try {
      await userInfo();
    } catch (error) {
      console.error("Failed to initialize user data:", error);

      // If initialization fails on a protected route, redirect to login
      if (to.path.startsWith("/user")) {
        return navigateTo("/login");
      }
    }
  }
});
