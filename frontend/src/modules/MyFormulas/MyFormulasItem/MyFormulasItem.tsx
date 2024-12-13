import { FC } from "react";
import { IFomulaItem } from "../types";
import s from "./MyFormulasItem.module.css";
import 'katex/dist/katex.min.css';
import { BlockMath } from "react-katex";

export const MyFormulasItem: FC<IFomulaItem> = ({ name, content }) => {
  console.log(typeof content);
  return (
    <div className={s.formulaItem}>
      <div className={s.header}>
        <span className={s.title}>{name}</span>
        <span className={s.export}>Экспортировать</span>
      </div>
      <div className={s.formula}>
        <BlockMath>{content}</BlockMath>
      </div>
    </div>
  );
};
