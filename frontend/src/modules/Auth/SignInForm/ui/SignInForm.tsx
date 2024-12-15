import { Button } from "@/shared/ui/Button";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import s from "./SignInForm.module.css";
import { Input } from "@/shared/ui/Input";
import { useLoginUser } from "../model/useLoginUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ILoginUser } from "@/shared/api/authService/types";
import { useLogin2Step } from "../model/useLogin2Step";

interface SignInForm {
  username: string;
  password: string;
}

export const SignInForm: FC = () => {
  const { handleSubmit, register } = useForm<SignInForm>();
  const { loginUser, isError, isPending, isSuccess } = useLoginUser();
  const { loginUser2Step, isPending: is2StepPending } = useLogin2Step();
  const router = useNavigate();

  const [is2FA, setIs2FA] = useState(false);
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(120);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (data: ILoginUser) => {
    const loginData = await loginUser(data);
    if (loginData.access_token) {
      localStorage.setItem("accessToken", loginData.access_token);
      localStorage.setItem("refreshToken", loginData.refresh_token);
      router("/");
    } else if (loginData.message) {
      setIs2FA(true);
      setUsername(data.username);
      setPassword(data.password);
      toast.info(loginData.message);
    }
  };

  const handle2FACodeSubmit = async () => {
    const result = await loginUser2Step({ username, code });
    if (result.access_token) {
      localStorage.setItem("accessToken", result.access_token);
      localStorage.setItem("refreshToken", result.refresh_token);
      router("/");
    }
  };

  const requestNewCode = async () => {
    setCode("");
    setTimer(120);

    const loginData = await loginUser({ username, password });
    if (loginData.message) {
      setIs2FA(true);
      toast.info(loginData.message);
    } else if (loginData.access_token) {
      localStorage.setItem("accessToken", loginData.access_token);
      localStorage.setItem("refreshToken", loginData.refresh_token);
      router("/");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (is2FA && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [is2FA, timer]);

  return (
    <>
      {!is2FA && (
        <form
          className={s.form}
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Input
            register={register("username")}
            fullWidth={true}
            label="Логин"
          />
          <Input
            type="password"
            register={register("password")}
            fullWidth={true}
            label="Пароль"
          />
          <Button text="Войти" size="M" fontSize={24} />
        </form>
      )}

      {is2FA && (
        <div className={s.twoFactorContainer}>
          <div className={s.text}>
            Откройте{" "}
            <a href="https://t.me/EquillibriaBot" className={s.bot}>
              @EquillibriaBot
            </a>{" "}
            в Telegram и введите полученный код
          </div>
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth={true}
            label="Введите 2FA код"
          />
          {timer === 0 ? (
            <Button
              text="Запросить повторно"
              size="XL"
              fontSize={24}
              onClick={requestNewCode}
            />
          ) : (
            <Button
              disabled={is2StepPending}
              text="Подтвердить"
              size="L"
              fontSize={24}
              onClick={handle2FACodeSubmit}
            />
          )}
          <div className={s.timer}>
            {timer > 0 ? (
              <>
                Код истекает через <span className={s.time}>{timer}</span>{" "}
                секунд
              </>
            ) : (
              "Код истек"
            )}
          </div>
        </div>
      )}
      {!is2FA && (
        <>
          <span className={s.forgetPassword}>Еще нет аккаунта?</span>
          <span className={s.login} onClick={() => router("/signup")}>
            Зарегистрироваться
          </span>
        </>
      )}
    </>
  );
};
