import { Button } from "@/shared/ui/Button";
import { FC } from "react";
import { useForm } from "react-hook-form";
import s from "./SignInForm.module.css";
import { Input } from "@/shared/ui/Input";
import { useLoginUser } from "../model/useLoginUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userStore } from "@/store/user";
import { ILoginUser } from "@/shared/api/authService/types";

interface SignInForm {
  username: string;
  password: string;
}

export const SignInForm: FC = () => {
  const { handleSubmit, register } = useForm<SignInForm>();

  const { loginUser, isError, isPending, isSuccess } = useLoginUser();

  const router = useNavigate();

  const onSubmit = async (data: ILoginUser) => {
    try {
      const tokens = await loginUser(data);
      if (tokens) {
        localStorage.setItem("accessToken", tokens.access_token);
        localStorage.setItem("refreshToken", tokens.refresh_token);
        userStore.setUsername(data.username);
        router("/");
      }
    } catch {
      toast.error("Неверные данные");
    }
  };

  return (
    <>
      <form
        className={s.form}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input register={register("username")} fullWidth={true} label="Логин" />
        <Input
          type="password"
          register={register("password")}
          fullWidth={true}
          label="Пароль"
        />
        <Button text="Войти" size="M" fontSize="M" />
      </form>
    </>
  );
};
