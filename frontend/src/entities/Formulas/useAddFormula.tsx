import { createFormula } from "@/shared/api/formulasService/formulasController";
import { useMutation } from "@tanstack/react-query";

export const useAddFomula = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: () => createFormula(),
  });

  const addFormula = () => mutate();

  return {
    addFormula,
    isPending,
    isError,
    isSuccess,
  };
};
