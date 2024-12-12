import { deleteFormulaById } from "@/shared/api/formulasService/formulasController";
import { useMutation } from "@tanstack/react-query";

export const useDeleteFormulaList = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteFormulaById(id),
  });

  const deleteFormula = (id: number) => mutate({ id });

  return {
    deleteFormula,
    isPending,
    isError,
    isSuccess,
  };
};
