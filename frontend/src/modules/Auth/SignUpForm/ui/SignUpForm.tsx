import { Button } from "@/shared/ui/Button";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import s from "./SignUpForm.module.css";
import { Input } from "@/shared/ui/Input";
import { FormError } from "@/shared/ui/FormError";
import { useRegisterUser } from "../model/useRegisterUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/shared/ui/Checkbox/Checkbox";
import { generateQRCode } from "@/shared/lib/generateQRCode";
import { QRGenerator } from "@/shared/components/QRgenerator";

interface SignUpForm {
  username: string;
  password: string;
  confirmPassword: string;
  twoFA: boolean;
}

export const SignUpForm: FC = () => {
  const router = useNavigate();

  const { registerUser, isError, isPending, isSuccess } = useRegisterUser();
  const [isTwoFA, setIsTwoFA] = useState(false);
  const [url, setUrl] = useState<string>("");
  const [QR, setQR] = useState();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm<SignUpForm>();
  const password = watch("password");

  useEffect(() => {
    setValue("twoFA", isTwoFA);
  }, [isTwoFA]);

  const onSubmit = async (data) => {
    if (isTwoFA) {
      const response = await registerUser({
        username: data.username,
        password: data.password,
        telegram_2fa: true,
      });
      setUrl(response.data.url);
    } else {
      registerUser({
        username: data.username,
        password: data.password,
        telegram_2fa: data.twoFA,
      });
    }
  };

  if (isSuccess && !isTwoFA) {
    toast.success("Успешная регистрация!");
    router("/signin");
  }

  return (
    <>
      {!url ? (
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
                maxLength: {
                  value: 12,
                  message: "Логин должен содержать не более 12 символов",
                },
                pattern: {
                  value: /^[a-z0-9]+$/,
                  message: "Логин должен содержать только латинские символы",
                },
              })}
              label="Логин"
            />
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
                maxLength: {
                  value: 16,
                  message: "Пароль должен содержать не более 16 символов",
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
                validate: (value) =>
                  value === password || "Пароли не совпадают",
              })}
              label="Подтвердите пароль"
            />
            {errors.confirmPassword?.message && (
              <FormError text={errors.confirmPassword.message} />
            )}
          </div>
          <div className={s.checkbox}>
            <div onClick={() => setIsTwoFA(!isTwoFA)}>
              <Checkbox isChecked={isTwoFA} register={register("twoFA")} />
            </div>
            <span>Двухфакторная аутентификация через Telegram</span>
          </div>
          <Button
            text="Зарегистрироваться"
            size="XL"
            fontSize={24}
            disabled={isPending}
          />
        </form>
      ) : (
        <div>
          <div className={s.textWrapper}>
            <div className={s.linkWrapper}>
              <p className={s.text}>
                Сканируйте QR-код или перейдите по следующей ссылке:
              </p>
              <a className={s.link} href={`https://${url}`}>
                {"@EquillibriaBot"}
              </a>
            </div>
          </div>
          <p className={s.text}>
            После настройки 2FA, вы можете войти в систему.
          </p>
          <div className={s.qr}>
            <QRGenerator text={url} />
          </div>
        </div>
      )}
    </>
  );
};
