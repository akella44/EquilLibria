import { queryClient } from "@/shared/api/queryClient";
import { updateFormulaById } from "@api/formulasService/formulasController";
import { IAddFormula } from "@api/formulasService/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateFomula = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ id, data }) => updateFormulaById(id, data),
    onSuccess: () => {
      toast.success("Формула изменена");
      queryClient.invalidateQueries("formulaList");
    },
  });

  const updateFormula = (id: number, data: IAddFormula) => mutate({ id, data });

  return {
    updateFormula,
    isPending,
    isError,
    isSuccess,
  };
};
