import { FC } from "react";
import { DetailedFormulaItem } from "./types";
import MathJax from "react-mathjax2";
import s from "./FormulaItem.module.css";
import { Button } from "@/shared/ui/Button";

export const FormulaItem: FC<DetailedFormulaItem> = ({
  title,
  formula,
  description,
}) => {
  return (
    <div className={s.formulaItem}>
      <div className={s.header}>
        <h2 className={s.title}>{title}</h2>
        <Button variant="purple" text="Экспорт" fontSize={20} />
      </div>
      <div className={s.formula}>
        <MathJax.Context input="ascii">
          <MathJax.Node>{formula}</MathJax.Node>
        </MathJax.Context>
      </div>
      <div className={s.description}>
        {description.map((string) => (
          <p className={s.desctiptionItem}>{string}</p>
        ))}
      </div>
    </div>
  );
};
