import axios from "axios";
import { apiKey } from "../config";
import { addTokenToHeader } from "../commonFeatures";
import { refreshToken } from "../TokenService/tokenControllerApi";

const userController = axios.create({
  baseURL: apiKey + "/users/me",
});

userController.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await refreshToken();
        const originalRequest = error.config;
        return userController(originalRequest);
      } catch (refreshError) {
        console.error("Ошибка при обновлении токена:", refreshError);
      }
    } else {
      console.error(
        "Ошибка:",
        error.response ? error.response.status : error.message
      );
    }
    return Promise.reject(error);
  }
);

userController.interceptors.request.use((config) => addTokenToHeader(config));

export const getCurrentUser = async () => {
  const response = await userController.get("");
  return response;
};
