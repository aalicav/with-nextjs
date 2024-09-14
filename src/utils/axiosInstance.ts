import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const auth = Cookies.get("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: { message: string; statusCode: number } = {
      message: error.response?.data?.message || "Erro desconhecido",
      statusCode: error.response?.status || 500,
    };

    return Promise.reject(customError);
  }
);