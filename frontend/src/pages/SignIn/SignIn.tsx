import { FC } from "react";
import { SignInForm } from "@modules/Auth/SignInForm";
import { PageLayoutWithoutHeader } from "@app/layouts/PageLayoutWithoutHeader";
import s from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { BigLogo } from "@/shared/ui/BigLogo";

export const SignIn: FC = () => {
  const router = useNavigate();

  return (
    <PageLayoutWithoutHeader>
      <div className={s.signInPage}>
        <div className={s.wrapper}>
          <h2 className={s.greetings}>Добро пожаловать!</h2>
          <div className={s.logoWrapper}>
            <BigLogo />
          </div>
          <div className={s.formWrapper}>
            <SignInForm />
          </div>
          <span className={s.forgetPassword}>Еще нет аккаунта?</span>
          <span className={s.login} onClick={() => router("/signup")}>
            Зарегистрироваться
          </span>
        </div>
      </div>
    </PageLayoutWithoutHeader>
  );
};
