import axios from "axios";
import { apiKey } from "../config";
import { addTokenToHeader } from "../commonFeatures";
import { IAddFormula } from "./types";
import { refreshToken } from "../TokenService/tokenControllerApi";

const formulasController = axios.create({
  baseURL: apiKey + "/formulas",
});

formulasController.interceptors.request.use((config) =>
  addTokenToHeader(config)
);

formulasController.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await refreshToken();
        const originalRequest = error.config;
        return formulasController(originalRequest);
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

export const getFormulas = async () => {
  return formulasController.get("/me");
};

export const createFormula = async (data: IAddFormula) => {
  const response = await formulasController.post("/", data);
  return response;
};

export const updateFormulaById = async (
  formulaId: number,
  data: IAddFormula
) => {
  return formulasController.patch(`/${formulaId}`, data);
};

export const deleteFormulaById = async (formulaId: number) => {
  return formulasController.delete(`/${formulaId}`);
};

export const getStaticSimilarFormulasByLatex = async (latex: string) => {
  const response = await formulasController.post(`/static-analyze`, latex);
  return response;
};

export const getSemanticSimilarFormulasByLatex = async (latex: string) => {
  const response = await formulasController.post(`/semantic-analyze`, latex);
  return response;
};
