import { deleteFormulaById } from "@/shared/api/formulasService/formulasController";
import { queryClient } from "@/shared/api/queryClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteFormula = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteFormulaById(id),
    onSuccess: () => {
      toast.success("Формула удалена");
      queryClient.invalidateQueries("formulaList");
    },
  });

  const deleteFormula = (id: number) => mutate({ id });

  return {
    deleteFormula,
    isPending,
    isError,
    isSuccess,
  };
};
