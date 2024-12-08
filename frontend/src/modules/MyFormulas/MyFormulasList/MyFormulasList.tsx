import { FC } from "react";
import { MyFormulasItem } from "../MyFormulasItem";
import { IFomulaItem } from "../types";
import s from "./MyFormulasList.module.css";

interface IMyFormulasList {
  formulaList: IFomulaItem[];
}

export const MyFormulasList: FC<IMyFormulasList> = ({ formulaList = [] }) => {
  return (
    <ul className={s.formulasList}>
      {formulaList.map((formula, index) => (
        <li className={s.formulasList_item} key={index}>
          <MyFormulasItem title={formula.title} formula={formula.formula} />
        </li>
      ))}
    </ul>
  );
};
