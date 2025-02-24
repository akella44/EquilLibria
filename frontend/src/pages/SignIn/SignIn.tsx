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
          <div className={s.logoWrapper}>
            <BigLogo />
          </div>
          <h2 className={s.greetings}>Добро пожаловать!</h2>
          <div className={s.formWrapper}>
            <SignInForm />
          </div>
        </div>
      </div>
    </PageLayoutWithoutHeader>
  );
};
