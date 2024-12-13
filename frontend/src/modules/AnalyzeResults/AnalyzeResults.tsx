import { FC } from "react";
import s from './AnalyzeResults.module.css'

export const AnalyzeResults: FC = () => {
  return (
    <div className={s.analyzeResults}>
      <h2 className={s.title}>Результаты анализа</h2>
      <h3 className={s.h3}>Совпадения</h3>
    </div>
  );
};
