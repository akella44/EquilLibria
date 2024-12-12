import { FC } from "react";
import { IFomulaItem } from "../types";
import MathJax from "react-mathjax2";
import s from "./MyFormulasItem.module.css";

export const MyFormulasItem: FC<IFomulaItem> = ({ name, content }) => {
  return (
    <div className={s.formulaItem}>
      <div className={s.header}>
        <span className={s.title}>{name}</span>
        <span className={s.export}>Экспортировать</span>
      </div>
      <MathJax.Context input="ascii">
        <div className={s.formula}>
          <MathJax.Node>{content}</MathJax.Node>
        </div>
      </MathJax.Context>
    </div>
  );
};
