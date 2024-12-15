import { FC } from "react";
import s from "./ResultLIst.module.css";
import { ResultItem } from "../ResultItem";

export const ResultLIst: FC = () => {
  const resulstList = [1, 2, 3, 4, 5];
  return (
    <div className={s.resultList}>
      <div className={s.wrapper}>
      {resulstList?.map((item) => (
        <ResultItem />
      ))}
      </div>
    </div>
  );
};
