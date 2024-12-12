import { Button } from "@/shared/ui/Button";
import { FC } from "react";
import { useForm } from "react-hook-form";
import s from "./SignUpForm.module.css";
import { Input } from "@/shared/ui/Input";
import { FormError } from "@/shared/ui/FormError";
import { IRegisterUser } from "@/shared/api/authService/types";
import { useRegisterUser } from "../model/useRegisterUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface SignUpForm {
  username: string;
  password: string;
  confirmPassword: string;
}

export const SignUpForm: FC = () => {
  const router = useNavigate();

  const { registerUser, isError, isPending, isSuccess, error } =
    useRegisterUser();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();
  const password = watch("password");

  const onSubmit = (data: IRegisterUser) =>
    registerUser({
      username: data.username,
      password: data.password,
    });

  if (isSuccess) {
    toast.success("Успешная регистрация!");
    router("/signin");
  }

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <div className={s.inputWrapper}>
        <Input
          register={register("username", {
            required: "Логин обязателен",
            minLength: {
              value: 6,
              message: "Логин должен содержать не менее 6 символов",
            },
            pattern: {
              value: /^[a-z0-9]+$/,
              message: "Логин должен содержать только латинские символы",
            },
          })}
          label="Логин"
        />
        {error && <FormError text={error} />}
        {errors.username?.message && (
          <FormError text={errors.username.message} />
        )}
      </div>
      <div className={s.inputWrapper}>
        <Input
          type="password"
          register={register("password", {
            required: "Пароль обязателен",
            minLength: {
              value: 8,
              message: "Пароль должен содержать не менее 8 символов",
            },
            pattern: {
              value: /^[a-z0-9]+$/,
              message: "Пароль должен содержать только латинские символы",
            },
          })}
          label="Пароль"
        />
        {errors.password?.message && (
          <FormError text={errors.password.message} />
        )}
      </div>
      <div className={s.inputWrapper}>
        <Input
          type="password"
          register={register("confirmPassword", {
            required: "Подтверждение пароля обязательно",
            validate: (value) => value === password || "Пароли не совпадают",
          })}
          label="Подтвердите пароль"
        />
        {errors.confirmPassword?.message && (
          <FormError text={errors.confirmPassword.message} />
        )}
      </div>
      <Button text="Зарегистрироваться" size="XL" fontSize="M" />
    </form>
  );
};
