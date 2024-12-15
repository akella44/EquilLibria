import { FC } from "react";
import s from "./ResultLIst.module.css";
import { ResultSemanticItem } from "../ResultSemanticItem";
import { ResultStaticItem } from "../ResultStaticItem";

export const ResultLIst: FC = ({ staticList, semanticList }) => {
  const resulstList = [1, 2, 3, 4, 5];

  if (semanticList?.length > 0) {
    return (
      <div className={s.resultList}>
        <div className={s.wrapper}>
          {semanticList?.map((item) => (
            <ResultSemanticItem
              fonudLatex={item.found_latex}
              percentage={item.percentage}
            />
          ))}
        </div>
      </div>
    );
  } else if (staticList?.length > 0) {
    return (
      <div className={s.resultList}>
        <div className={s.wrapper}>
          {staticList?.map((item) => (
            <ResultStaticItem
              foundLatex={item.found_latex}
              originalLatex={item.original_latex}
              subexpressions={item.subexpressions}
            />
          ))}
        </div>
      </div>
    );
  }
};
