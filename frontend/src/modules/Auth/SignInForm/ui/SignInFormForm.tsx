import { Button } from "@/shared/ui/Button";
import { FC } from "react";
import { useForm } from "react-hook-form";
import s from "./SignInForm.module.css";
import { Input } from "@/shared/ui/Input";

interface SignInForm {
  username: string;
  password: string;
}

export const SignInForm: FC = ({ onSubmit }) => {
  const { handleSubmit, register } = useForm<SignInForm>();

  return (
    <>
      <form
        className={s.form}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input fullWidth={true} label="Логин" />
        <Input fullWidth={true} label="Пароль" />
        <Button text="Войти" size="M" fontSize="M" />
      </form>
    </>
  );
};
