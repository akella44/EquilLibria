import axios from "axios";
import { apiKey } from "../config";
import { addTokenToHeader } from "../commonFeatures";
import { refreshToken } from "../TokenService/tokenControllerApi";

const fileController = axios.create({
  baseURL: apiKey + "/files",
});

fileController.interceptors.request.use((config) => addTokenToHeader(config));

fileController.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await refreshToken();
        const originalRequest = error.config;
        return fileController(originalRequest);
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

export const uploadFiles = async (file: File) => {
  const data = new FormData();
  data.append("file", file);
  return fileController.post("/upload", data);
};

export const getImageById = async (id: number) => {
  const response = await fileController.get(`/images/${id}`);
  return response;
};

export const getLatexByRectId = async (id: number) => {
  const response = await fileController.get(`/rects/${id}`);
  return response;
};
