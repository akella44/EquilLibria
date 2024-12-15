import { FC, useState } from "react";
import s from "./ResultStaticItem.module.css";
import { EmptyArrow } from "@/shared/assets/icons/EmptyArrow/EmptyArrow";
import { BlockMath } from "react-katex";
import { Separator } from "@/shared/ui/Separator/Separator";

interface ResultItemProps {
  originalLatex: string;
  foundLatex: string;
  subexpressions: string[];
}

const highlightSubexpressions = (text: string, subexpressions: string[]) => {
  const escapedSubexpressions = subexpressions.map((sub) =>
    sub.replace(/[-\/\\^$.*+?()[\]{}|]/g, "\\$&")
  );

  const regex = new RegExp(`(${escapedSubexpressions.join("|")})`, "g");

  const parts = text.split(regex).map((part, index) => {
    if (subexpressions.some((sub) => sub === part)) {
      return (
        <span key={index} className={s.highlighted}>
          {part}
        </span>
      );
    }
    return part;
  });

  return parts;
};

export const ResultStaticItem: FC<ResultItemProps> = ({
  originalLatex,
  foundLatex,
  subexpressions,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={s.resultItem}>
      <div className={s.header} onClick={() => setIsVisible(!isVisible)}>
        <div className={s.formulaField}>
          <BlockMath>{foundLatex}</BlockMath>
        </div>
        <div className={s.wrapper}>
          <div
            className={s.iconWrapper}
            style={isVisible ? { transform: "rotate(90deg)" } : undefined}
          >
            <EmptyArrow />
          </div>
        </div>
      </div>
      <div className={`${s.content} ${isVisible ? s.visible : ""}`}>
        <div className={s.source}>
          <h3 className={s.title}>Оригинал</h3>
          <span className={s.text}>
            {highlightSubexpressions(originalLatex, subexpressions)}
          </span>
        </div>
        <div>
          <h3 className={s.title}>Найденная формула</h3>
          <span className={s.text}>
            {highlightSubexpressions(foundLatex, subexpressions)}
          </span>
        </div>
      </div>
      <div className={s.separator}>
        <Separator />
      </div>
    </div>
  );
};
