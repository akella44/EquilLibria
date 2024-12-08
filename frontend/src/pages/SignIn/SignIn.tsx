import { FC, useEffect } from "react";
import { SignInForm } from "@modules/Auth/SignInForm";
import { PageLayoutWithoutHeader } from "@app/layouts/PageLayoutWithoutHeader";
import s from "./SignIn.module.css";
import bg from "@assets/bg.svg";
import { useAuthToken } from "@/shared/hooks/useAuthToken";
import { useLoginUser } from "@/modules/Auth/SignInForm/model/useLoginUser";
import { useNavigate } from "react-router-dom";
import { BigLogo } from "@/shared/ui/BigLogo";

export const SignIn: FC = () => {
  const { loginUser, isError, isPending } = useLoginUser();
  const { addAccessToken, getAccessToken } = useAuthToken();
  const router = useNavigate();

  // useEffect(() => {
  //   if (!isPending && !isError && getAccessToken()) {
  //     router("/");
  //   }
  // }, [isPending, isError, getAccessToken, router]);

  const onSubmit = async (data) => {
    const token = await loginUser(data);
    addAccessToken(token);
  };

  return (
    <PageLayoutWithoutHeader>
      <div className={s.signInPage}>
        <div className={s.wrapper}>
          <h2 className={s.greetings}>Добро пожаловать!</h2>
          <div className={s.logoWrapper}>
            <BigLogo />
          </div>
          <div className={s.formWrapper}>
            <SignInForm onSubmit={onSubmit} />
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
