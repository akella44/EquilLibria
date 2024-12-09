import axios from "axios";
import { apiKey } from "../config";
import { ILoginUser, IRegisterUser } from "./types";
import { addTokenToHeader } from "../commonFeatures";

const authController = axios.create({
  baseURL: apiKey,
});

authController.interceptors.request.use((config) => addTokenToHeader(config));

export const register = async (data: IRegisterUser) => {
  return authController.post("/jwt/register", data);
};

export const login = async (data: ILoginUser) => {
  const response = await authController.post("/jwt/login", data);
  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
};
