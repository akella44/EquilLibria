import { FC } from "react";
import s from "./AnalyzeResults.module.css";
import { ResultLIst } from "./ResultLIst";

export const AnalyzeResults: FC = ({ staticList, semanticList }) => {
  return (
    <>
      <div className={s.analyzeResults}>
        <h2 className={s.title}>Результаты статического анализа</h2>
        <div>
          <ResultLIst staticList={staticList} />
        </div>
      </div>
      <div className={s.analyzeResults}>
        <h2 className={s.title}>Результаты семантического анализа</h2>
        <div>
          <ResultLIst semanticList={semanticList} />
        </div>
      </div>
    </>
  );
};
