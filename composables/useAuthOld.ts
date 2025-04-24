import { ref } from "vue";

export const useAuth = () => {
  const user = ref(null);
  const token = ref<string | null>(null);

  const setUserToken = (newToken: string) => {
    token.value = newToken;

    // Save the token in localStorage or cookies if needed
    if (process.client) {
      localStorage.setItem("authToken", newToken);
    }
  };

  const setUser = (userData: any) => {
    user.value = userData;
  };

  const loadUserFromLocalStorage = () => {
    if (process.client) {
      const savedToken = localStorage.getItem("authToken");
      if (savedToken) {
        token.value = savedToken;
        // Optionally fetch user data from the server with this token
      }
    }
  };

  return {
    user,
    token,
    setUserToken,
    setUser,
    loadUserFromLocalStorage,
  };
};
