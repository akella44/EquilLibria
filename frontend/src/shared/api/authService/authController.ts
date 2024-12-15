import axios from "axios";
import { apiKey } from "../config";
import { ILoginUser, IRegisterUser } from "./types";
import { addTokenToHeader } from "../commonFeatures";

const authController = axios.create({
  baseURL: apiKey,
});

authController.interceptors.request.use((config) => addTokenToHeader(config));

export const register = async (data: IRegisterUser) => {
  try {
    const response = await authController.post("/jwt/register", data);
    return response;
  } catch (err) {
    throw err;
  }
};

export const login = async (data: ILoginUser) => {
  try {
    const response = await authController.post("/jwt/login", data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const login2Step = async (data: { username: string; code: string }) => {
  try {
    const response = await authController.post("/jwt/login-2-step", data);
    return response.data;
  } catch (err) {
    throw err;
  }
};
