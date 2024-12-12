import { FC } from "react";
import { DetailedFormulaItem } from "./types";
import MathJax from "react-mathjax2";
import s from "./FormulaItem.module.css";
import { Button } from "@/shared/ui/Button";

export const FormulaItem: FC<DetailedFormulaItem> = ({
  name,
  content,
  description,
  legends,
}) => {
  return (
    <div className={s.formulaItem}>
      <div className={s.header}>
        <h2 className={s.title}>{name}</h2>
        <Button variant="purple" text="Экспорт" fontSize={20} />
      </div>
      <div className={s.formula}>
        <MathJax.Context input="ascii">
          <MathJax.Node>{content}</MathJax.Node>
        </MathJax.Context>
      </div>
      <div className={s.description}>
        {legends?.map((string, index) => (
          <p key={index} className={s.desctiptionItem}>
            {string}
          </p>
        ))}
        {description}
      </div>
    </div>
  );
};
