import { FC } from "react";
import s from "./AnalyzeResults.module.css";
import { ResultLIst } from "./ResultLIst";

export const AnalyzeResults: FC = () => {
  return (
    <div className={s.analyzeResults}>
      <h2 className={s.title}>Результаты анализа</h2>
      <ResultLIst />
    </div>
  );
};
