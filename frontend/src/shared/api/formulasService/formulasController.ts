import axios from "axios";
import { apiKey } from "../config";
import { addTokenToHeader } from "../commonFeatures";
import { IAddFormula } from "./types";

const formulasController = axios.create({
  baseURL: apiKey + "/formulas",
});

formulasController.interceptors.request.use((config) =>
  addTokenToHeader(config)
);

export const getFormulas = async () => {
  axios.defaults.headers.common["Authorization"] =
    localStorage.getItem("accessToken");
  return formulasController.get("/me");
};

export const createFormula = async (data: IAddFormula) => {
  axios.defaults.headers.common["Authorization"] =
    localStorage.getItem("accessToken");
  return formulasController.post("/", data);
};

export const updateFormulaById = async (formulaId: number) => {
  return formulasController.patch(`/${formulaId}`);
};

export const deleteFormulaById = async (formulaId: number) => {
  return formulasController.delete(`/${formulaId}`);
};
