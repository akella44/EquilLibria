import { FC } from "react";
import MathJax from "react-mathjax2";
import s from "./KeyboardButton.module.css";
import classNames from "classnames";

interface IKeyboardButton {
  value: string;
  variant: "light" | "light-purple" | "purple";
  className?: string;
}

export const KeyboardButton: FC<IKeyboardButton> = ({
  value,
  className = "",
  variant = "light",
}) => {
  return (
    <button
      className={classNames(
        className && className,
        s.button,
        s.nonselect,
        variant && s[variant]
      )}
    >
      <MathJax.Context input="ascii">
        <MathJax.Node>{value}</MathJax.Node>
      </MathJax.Context>
    </button>
  );
};
