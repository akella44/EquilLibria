import { useMutation } from "@tanstack/react-query";
import { register } from "@api/authService/authController";
import { IRegisterUser } from "@api/authService/types";
import { toast } from "react-toastify";

export const useRegisterUser = () => {
  const { mutateAsync, isError, isPending, isSuccess } = useMutation({
    mutationFn: ({ data }: { data: IRegisterUser }) => register(data),
    onError: (err) => toast.error(err?.response?.data.detail),
  });
  const registerUser = (data: IRegisterUser) => mutateAsync({ data });

  return {
    registerUser,
    isError,
    isPending,
    isSuccess,
  };
};
