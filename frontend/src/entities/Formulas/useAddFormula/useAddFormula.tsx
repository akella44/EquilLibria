import { queryClient } from "@/shared/api/queryClient";
import { createFormula } from "@api/formulasService/formulasController";
import { IAddFormula } from "@api/formulasService/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAddFomula = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ data }: { data: IAddFormula }) => createFormula(data),
    onSuccess: () => {
      toast.success("Формула добавлена");
      queryClient.invalidateQueries("formulaList");
    },
  });

  const addFormula = (data: IAddFormula) => mutate({ data });

  return {
    addFormula,
    isPending,
    isError,
    isSuccess,
  };
};
