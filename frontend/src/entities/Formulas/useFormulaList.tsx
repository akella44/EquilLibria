import { getFormulas } from "@/shared/api/formulasService/formulasController";
import { useQuery } from "@tanstack/react-query";

export const useFormulaList = () => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["fomulaList"],
    queryFn: () => getFormulas(),
  });
  return {
    data,
    isLoading,
    isError,
    isSuccess,
  };
};