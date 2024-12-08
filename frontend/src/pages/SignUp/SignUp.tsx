import { FC, useEffect } from "react";
import { PageLayoutWithoutHeader } from "@app/layouts/PageLayoutWithoutHeader";
import s from "./SignUp.module.css";
import { useAuthToken } from "@/shared/hooks/useAuthToken";
import { useLoginUser } from "@/modules/Auth/SignInForm/model/useLoginUser";
import { useNavigate } from "react-router-dom";
import { BigLogo } from "@/shared/ui/BigLogo";
import { SignUpForm } from "@/modules/Auth/SignUpForm";

export const SignUp: FC = () => {
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
      <div className={s.signUpPage}>
        <div className={s.wrapper}>
          <h2 className={s.greetings}>Добро пожаловать!</h2>
          <div className={s.logoWrapper}>
            <BigLogo />
          </div>
          <div className={s.formWrapper}>
            <SignUpForm onSubmit={onSubmit} />
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
