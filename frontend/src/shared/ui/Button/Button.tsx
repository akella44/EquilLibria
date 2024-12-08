import classNames from "classnames";
import { ButtonHTMLAttributes, FC } from "react";
import s from "./Button.module.css";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "M" | "L" | "XL";
  variant?: "purple" | "grey";
  fullWidth?: boolean;
  text?: string;
  className?: string;
  fontSize?: "S" | "M";
}

export const Button: FC<IButton> = ({
  size = "M",
  variant = "purple",
  fullWidth = false,
  text = "",
  className = "",
  fontSize = "S",
  ...props
}) => {
  return (
    <button
      className={classNames(
        className && className,
        s.button,
        variant && s[variant],
        fullWidth ? s["button-full"] : s[`button-${size.toLowerCase()}`],
        fontSize && s[`font-${fontSize.toLowerCase()}`]
      )}
      {...props}
    >
      {text && text}
    </button>
  );
};
