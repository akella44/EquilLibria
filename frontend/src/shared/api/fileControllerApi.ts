import axios from "axios";
import { apiKey } from "./config";

const fileControllerApi = axios.create({
  baseURL: apiKey,
});

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fileControllerApi.post("/file/upload", formData, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
