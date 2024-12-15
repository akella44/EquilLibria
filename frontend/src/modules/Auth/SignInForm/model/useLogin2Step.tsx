import { useMutation } from "@tanstack/react-query";
import { login2Step } from "@api/authService/authController";
import { toast } from "react-toastify";

export const useLogin2Step = () => {
  const { mutateAsync, isError, isPending, isSuccess } = useMutation({
    mutationFn: async ({
      data,
    }: {
      data: { username: string; code: string };
    }) => login2Step(data),
    onError: (error) => {
      if (error.status === 422) {
        toast.error("Неверный код");
      } else if (error.status === 400) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message);
      }
    },
  });

  const loginUser2Step = (data: { username: string; code: string }) =>
    mutateAsync({ data });

  return { loginUser2Step, isError, isPending, isSuccess };
};
