import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { userInfo } from "@/services/userService";
import { useUser } from "~/composables/useUser";

export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  if (publicRoutes.includes(to.path)) {
    return;
  }
  const authToken = useCookie("authToken");
  if (authToken.value) {
    try {
      const userData = await userInfo();
      if (userData) {
        const { setUser } = useUser();
        setUser(userData);
      }
    } catch (error) {}
  }
});
