import { FC, useEffect } from "react";
import { PageLayoutWithoutHeader } from "@app/layouts/PageLayoutWithoutHeader";
import s from "./SignUp.module.css";
import { useAuthToken } from "@/shared/hooks/useAuthToken";
import { useNavigate } from "react-router-dom";
import { BigLogo } from "@/shared/ui/BigLogo";
import { SignUpForm } from "@/modules/Auth/SignUpForm";

export const SignUp: FC = () => {
  const router = useNavigate();
  return (
    <PageLayoutWithoutHeader>
      <div className={s.signUpPage}>
        <div className={s.wrapper}>
          <h2 className={s.greetings}>Добро пожаловать!</h2>
          <div className={s.logoWrapper}>
            <BigLogo />
          </div>
          <div className={s.formWrapper}>
            <SignUpForm />
          </div>
          <span className={s.forgetPassword}>Уже есть аккаунт?</span>
          <span className={s.login} onClick={() => router("/signin")}>
            Войти
          </span>
        </div>
      </div>
    </PageLayoutWithoutHeader>
  );
};
