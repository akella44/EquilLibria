import axios from "axios";
import { apiKey } from "../config";
import { ILoginUser, IRegisterUser } from "./types";
import { addTokenToHeader } from "../commonFeatures";
import { toast } from "react-toastify";

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
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
  } catch (err) {
    console.log(err);
    toast.error(err.message);
  }
};
