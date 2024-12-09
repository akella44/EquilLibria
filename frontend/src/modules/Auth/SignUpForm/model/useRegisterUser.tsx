import { useMutation } from "@tanstack/react-query";
import { register } from "@api/authService/authController";
import { IRegisterUser } from "@api/authService/types";

export const useRegisterUser = () => {
  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: ({ data }: { data: IRegisterUser }) => register(data),
  });
  const registerUser = (data: IRegisterUser) => mutate({ data });

  return {
    registerUser,
    isError,
    isPending,
    isSuccess,
    error: error?.response.data.detail,
  };
};
