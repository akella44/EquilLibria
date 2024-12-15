import { FC } from "react";
import s from "./ResultLIst.module.css";
import { ResultItem } from "../ResultItem";

export const ResultLIst: FC = () => {
  const resulstList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className={s.resultLIst}>
      {resulstList?.map((item) => (
        <ResultItem />
      ))}
    </div>
  );
};
