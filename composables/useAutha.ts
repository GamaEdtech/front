import { useState, useCookie, navigateTo } from 'nuxt/app';
import {computed} from 'vue'

// Define the expected response structure
interface AuthResponse {
  jwtToken: string;
  user: any;  // You can refine the 'user' type if you have more details about the user structure
}

export const useAutha = () => {
  const user = useState<any>('user', () => null);  // User state, initially null
  const token = useState<string | null>('authToken', () => null);  // Token state, initially null

  const cookieToken = useCookie<string | null>('authToken', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  const setUserToken = (newToken: string) => {
    token.value = newToken;  // Set token in state
    cookieToken.value = newToken;  // Set token in cookies
  };

  const setUser = (userData: any) => {
    user.value = userData;  // Set user data in state
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    cookieToken.value = null;
  };

  const loadUserFromCookie = async () => {
    if (cookieToken.value) {
      token.value = cookieToken.value;  // Load token from cookies

      try {
        const response = await $fetch('/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${cookieToken.value}`,
          },
        }) as AuthResponse;  // Type-cast the response to match our interface

        setUserToken(cookieToken.value); // ✅ Ensure state + cookie are synced
        setUser(response.user); // ✅ Set the user data
      } catch (error) {
        clearAuth();  // Clear auth if there's an error
      }
    }
  };

  const logout = () => {
    clearAuth();  // Clear token, user state, and cookie
    navigateTo('/login');  // Optionally redirect the user to the login page
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await $fetch('/api/v1/users/login', {
        method: 'POST',
        body: credentials,
      }) as AuthResponse;  // Type-cast the response to match our interface

      setUserToken(response.jwtToken);  // Set token in state and cookies
      setUser(response.user);  // Set user data in state

      navigateTo('/dashboard');  // Redirect user after successful login
    } catch (error) {
      throw new Error('Login failed. Please try again.');  // Handle login error
    }
  };

  const register = async (formData: { name: string; email: string; password: string }) => {
    try {
      const response = await $fetch('/api/v1/users/register', {
        method: 'POST',
        body: formData,
      }) as AuthResponse;  // Type-cast the response to match our interface

      setUserToken(response.jwtToken);  // Set token in state and cookies
      setUser(response.user);  // Set user data in state

      navigateTo('/dashboard');  // Redirect user after successful registration
    } catch (error) {
      throw new Error('Registration failed. Please try again.');  // Handle registration error
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return {
    user,
    token,
    setUserToken,
    setUser,
    clearAuth,
    loadUserFromCookie,
    logout,
    login,
    register,
    isAuthenticated,
  };
};