import { InternalAxiosRequestConfig } from "axios";

const addTokenToHeader = (config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

export { addTokenToHeader };
