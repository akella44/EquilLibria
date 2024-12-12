import axios from "axios";
import { apiKey } from "../config";
import { addTokenToHeader } from "../commonFeatures";

const formulasController = axios.create({
  baseURL: apiKey + '/formulas',
});

formulasController.interceptors.request.use((config) => addTokenToHeader(config));

export const getFormulas = async () => {
  return formulasController.get("/me");
};

export const createFormula = async () => {
    return formulasController.post('/')
};

export const updateFormulaById = async (formulaId: number) => {
  return formulasController.patch(`/${formulaId}`)
};

export const deleteFormulaById = async (formulaId: number) => {
    return formulasController.delete(`/${formulaId}`)
};
