import { FC } from "react";
import { DetailedFormulaList } from "./types";
import { FormulaItem } from "../FormulaItem";
import { Separator } from "@/shared/ui/Separator/Separator";
import s from "./FormulaList.module.css";

export const FormulaList: FC<DetailedFormulaList> = ({ formulaList }) => {
  return (
    <div className={s.formulaList}>
      {formulaList.map((item, index) => (
        <div className={s.formulaItem}>
          <FormulaItem
            title={item.name}
            description={item.description}
            formula={item.content}
          />
          {index < formulaList.length - 1 && (
            <div className={s.separator}>
              <Separator />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
