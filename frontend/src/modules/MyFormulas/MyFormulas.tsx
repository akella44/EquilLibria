import { FC } from "react";
import s from "./MyFormulas.module.css";
import { MyFormulasList } from "./MyFormulasList";

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
  return (
    <div className={s.myFormulas}>
      <div className={s.header}>
        <h2 className={s.title}>Мои формулы</h2>
      </div>
      <MyFormulasList formulaList={list} />
    </div>
  );
};
