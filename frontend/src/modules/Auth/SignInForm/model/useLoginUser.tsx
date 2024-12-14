import { useMutation } from "@tanstack/react-query";
import { login } from "@api/authService/authController";
import { ILoginUser } from "@api/authService/types";
import { toast } from "react-toastify";

export const useLoginUser = () => {
  const { mutateAsync, isError, isPending, isSuccess } = useMutation({
    mutationFn: async ({ data }: { data: ILoginUser }) => login(data),
    onError: (error) => {
      if (error.status === 422) {
        toast.error("Неверные данные");
      } else if (error.status === 401) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    },
  });

  const loginUser = (data: ILoginUser) => mutateAsync({ data });

  return { loginUser, isError, isPending, isSuccess };
};
