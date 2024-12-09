import { useMutation } from "@tanstack/react-query";
import { login } from "@api/authService/authController";
import { ILoginUser } from "@api/authService/types";

export const useLoginUser = () => {
  const { mutateAsync, isError, isPending, isSuccess } = useMutation({
    mutationFn: async ({ data }: { data: ILoginUser }) => login(data),
  });

  const loginUser = (data: ILoginUser) => mutateAsync({ data });

  return { loginUser, isError, isPending, isSuccess };
};
