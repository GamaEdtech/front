import { useCookie } from "nuxt/app";

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

export const userInfo = async () => {
  const cookieToken = useCookie("authToken");

  try {
    const response = await $fetch<UserResponse>(
      `/api/v1/users/info?uid=${cookieToken.value}`,
      {
        method: "GET",
      }
    );
    return response.data;
  } catch (error) {
    const errorData = (error as ErrorResponse)?.response?.status;

    if ((error as ErrorResponse)?.response?.status === 400) {
      console.error(errorData);
    } else {
      console.error("Something went wrong.");
    }
    throw error;
  }
};

export default { userInfo };
