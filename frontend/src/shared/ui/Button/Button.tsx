import classNames from "classnames";
import { ButtonHTMLAttributes, FC } from "react";
import s from "./Button.module.css";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "M" | "L" | "XL";
  variant?: "purple" | "grey";
  fullWidth?: boolean;
  text?: string;
  className?: string;
  fontSize?: number;
}

export const Button: FC<IButton> = ({
  size = "",
  variant = "purple",
  fullWidth = false,
  text = "",
  className = "",
  fontSize = 20,
  ...props
}) => {
  return (
    <button
      className={classNames(
        className && className,
        s.button,
        variant && s[variant],
        fullWidth && s["button-full"],
        size && s[`button-${size.toLowerCase()}`]
      )}
      style={{ fontSize: fontSize }}
      {...props}
    >
      {text && text}
    </button>
  );
};
