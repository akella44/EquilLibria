import { FC } from "react";
import { DetailedFormulaItem } from "./types";
import s from "./FormulaItem.module.css";
import { Button } from "@shared/ui/Button";
import { Bin } from "@shared/assets/icons/Bin";
import { BlockMath } from "react-katex";
import { useDeleteFormula } from "@/entities/Formulas/useDeleteFormula";

export const FormulaItem: FC<DetailedFormulaItem> = ({
  id,
  name,
  content,
  description,
  legends,
}) => {
  const { deleteFormula } = useDeleteFormula();
  return (
    <div className={s.formulaItem}>
      <div className={s.header}>
        <h2 className={s.title}>{name}</h2>
        <div className={s.headerRight}>
          <Button variant="purple" text="Экспорт" fontSize={20} />
          <div onClick={() => deleteFormula(id)}>
            <Bin />
          </div>
        </div>
      </div>
      <div className={s.formula}>
        <BlockMath>{content}</BlockMath>
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
