import { FC } from "react";
import s from "./MyFormulasDetailed.module.css";
import { SearchBar } from "../SearchBar";
import { FormulaList } from "./FormulaList";
import { useFormulaList } from "@/entities/Formulas/useFormulaList/useFormulaList";

export const MyFormulasDetailed: FC = () => {
  const { data } = useFormulaList();
  return (
    <div className={s.myFormulasDetailed}>
      <div className={s.header}>
        <h1 className={s.title}>Мои формулы</h1>
        <SearchBar />
      </div>
      <FormulaList formulaList={data} />
    </div>
  );
};
