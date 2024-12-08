import classNames from "classnames";
import { FC, InputHTMLAttributes } from "react";
import s from "./Input.module.css";

interface IInput extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "M" | "L" | "XL";
  fullWidth?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  fontSize?: "S" | "M";
}

export const Input: FC<IInput> = ({
  size = "M",
  fullWidth = false,
  placeholder = "",
  className = "",
  label = "",
  fontSize = "S",
  ...props
}) => {
  return (
    <div>
      {label && <label className={s.label}>{label}</label>}
      <input
        placeholder={placeholder}
        className={classNames(
          className && className,
          s.input,
          fullWidth ? s["input-full"] : s[`input-${size.toLowerCase()}`],
        )}
        {...props}
      ></input>
    </div>
  );
};
