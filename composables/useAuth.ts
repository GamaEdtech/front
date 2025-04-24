import { useState, useCookie, navigateTo } from 'nuxt/app';
import {computed} from 'vue'


export const useAuth = () => {
  const token = useState<string | null>('authToken', () => null);  // Token state, initially null

  const cookieToken = useCookie<any>('authToken', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });


  const setUserToken = (newToken: string) => {
    token.value = newToken;  // Set token in state
    cookieToken.value = newToken;  // Set token in cookies
  };


  const clearAuth = () => {
    token.value = null;
    cookieToken.value = null;
  };

  const loadUserFromCookie = async () => {
    if (token.value) return;
  
    if (cookieToken.value) {
      token.value = cookieToken.value;
    } else {
      clearAuth();
    }
  };

  const logout = () => {
    clearAuth();  // Clear token, user state, and cookie
    navigateTo('/');  // Optionally redirect the user to the login page
  };

  const login = async (credentials: { identity: string; pass: string }) => {
    try {
      const response:any = await $fetch('/api/v1/users/login', {
        method: 'POST',
        body: {...credentials,
          type: "request",
        }
      }) 
      return response;
    } catch (error) {
      throw error;  // Handle login error
    }
  };

  const register = async (formData: {identity: string; pass: string;}) => {
    try {
      await $fetch('/api/v1/users/register', {
        method: 'POST',
        body: {...formData,
        type: "register"}
      })

    } catch (error) {
      throw error;  // Handle registration error
    }
  };

  const forgotPassword = async (passForm: {identity: string;}  ) => {
    try {
      const response:any = await $fetch('/api/v1/users/recovery', {
        method: 'POST',
        body: { ...passForm,
          type : "request"
         },
      });
      return response
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return {
    token,
    setUserToken,
    clearAuth,
    loadUserFromCookie,
    logout,
    login,
    register,
    isAuthenticated,
    forgotPassword
  };
};