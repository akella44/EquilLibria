import { FC } from "react";
import s from "./MyFormulas.module.css";
import { MyFormulasList } from "./MyFormulasList";
import { useFormulaList } from "@/entities/Formulas/useFormulaList";

const list = [
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula:
      "S = ∑(n=1 to N) (∏(k=1 to m) (a_{k,n}² + b_{k,n}²)) * (1 / √(2πσ²)) * e^(-(x - μ)² / (2σ²)) * ∫(t=0 to T) sin(ωt + φ) dt",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
  {
    title: "Закон Ома",
    formula: "U = I/R",
  },
];

export const MyFormulas: FC = () => {
  const { data } = useFormulaList();
  return (
    <div className={s.myFormulas}>
      <div className={s.header}>
        <h2 className={s.title}>Мои формулы</h2>
      </div>
      {data?.length ? (
        <MyFormulasList formulaList={data} />
      ) : (
        <p className={s.text}>Вы пока не сохранили ни одной формулы</p>
      )}
    </div>
  );
};
