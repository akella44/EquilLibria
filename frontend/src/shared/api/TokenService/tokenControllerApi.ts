import axios from "axios";
import { apiKey } from "../config";

const tokenController = axios.create({
  baseURL: apiKey,
});

export const refreshToken = async () => {
  const response = await tokenController.post("/jwt/refresh", null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  });

  if (response.statusText === "OK") {
    const data = await response.data;
    localStorage.setItem("accessToken", data.access_token);
  } else {
    console.error("Token refresh failed");
  }
};
