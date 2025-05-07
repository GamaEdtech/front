import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { useUser } from "@/composables/useUser";
import { useAuth } from "@/composables/useAuth";

interface UserResponse {
  data: any;
}

interface ErrorResponse {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip for public routes
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  const auth = useAuth();
  const authToken = auth.getUserToken();

  // Skip if no token
  if (!authToken) {
    if (to.path.startsWith("/user")) {
      return navigateTo("/login");
    }
    return;
  }

  try {
    const response = await $fetch<UserResponse>(`/api/v1/users/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response && response.data) {
      const { setUser } = useUser();
      setUser(response.data);
    } else if (to.path.startsWith("/user")) {
    }
  } catch (error) {
    const status = (error as ErrorResponse)?.response?.status;
    if ((status === 401 || status === 403) && to.path.startsWith("/user")) {
      return navigateTo("/");
    }
  }
});
