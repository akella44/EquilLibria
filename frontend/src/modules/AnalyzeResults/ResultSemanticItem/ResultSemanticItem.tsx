import { FC, useEffect, useState } from "react";
import s from "./ResultSemanticItem.module.css";
import { EmptyArrow } from "@/shared/assets/icons/EmptyArrow/EmptyArrow";
import { BlockMath } from "react-katex";
import { Separator } from "@/shared/ui/Separator/Separator";

interface ResultItemProps {
  fonudLatex: string;
  percentage: number;
}

export const ResultSemanticItem: FC<ResultItemProps> = ({
  fonudLatex,
  percentage,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={s.resultItem}>
      <div className={s.header} onClick={() => setIsVisible(!isVisible)}>
        <div className={s.formulaField}>
          <BlockMath>{fonudLatex}</BlockMath>
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
        <textarea value={fonudLatex}></textarea>
      </div>
      <div className={s.separator}>
        <Separator />
      </div>
    </div>
  );
};
