import { FC } from "react";
import { DetailedFormulaList } from "./types";
import { FormulaItem } from "../FormulaItem";
import { Separator } from "@/shared/ui/Separator/Separator";
import s from "./FormulaList.module.css";

export const FormulaList: FC<DetailedFormulaList> = ({ formulaList }) => {
  return (
    <div className={s.formulaList}>
      {formulaList?.map((item, index) => (
        <div key={item.id} className={s.formulaItem}>
          <FormulaItem
            name={item.name}
            description={item.description}
            content={item.content}
            legends={item.legends}
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
