import classNames from "classnames";
import { FC, InputHTMLAttributes } from "react";
import s from "./Input.module.css";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface IInput extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "M" | "L" | "XL";
  fullWidth?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  fontSize?: "S" | "M";
  register?: UseFormRegister<FieldValues>;
}

export const Input: FC<IInput> = ({
  size = "",
  fullWidth = false,
  placeholder = "",
  className = "",
  label = "",
  fontSize = "S",
  register,
  ...props
}) => {
  return (
    <div>
      {label && <label className={s.label}>{label}</label>}
      <input
        {...(register && register)}
        placeholder={placeholder}
        className={classNames(
          className && className,
          s.input,
          size ? s[`input-${size.toLowerCase()}`] : s["input-full"]
        )}
        {...props}
      ></input>
    </div>
  );
};
