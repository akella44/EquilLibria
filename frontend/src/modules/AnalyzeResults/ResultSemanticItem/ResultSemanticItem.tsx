import { FC, useEffect, useState } from "react";
import s from "./ResultSemanticItem.module.css";
import { EmptyArrow } from "@/shared/assets/icons/EmptyArrow/EmptyArrow";
import { BlockMath } from "react-katex";
import { Separator } from "@/shared/ui/Separator/Separator";

interface ResultItemProps {
  fonudLatex: string;
  percentage: number;
}

const getColorFromPercentage = (percentage: number): string => {
  const green = Math.round((1 - percentage / 100) * 255);
  const red = Math.round((percentage / 100) * 255);
  return `rgb(${red}, ${green}, 0)`; 
};

export const ResultSemanticItem: FC<ResultItemProps> = ({
  fonudLatex,
  percentage,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const percentageColor = getColorFromPercentage(percentage);

  return (
    <div className={s.resultItem}>
      <div className={s.header} onClick={() => setIsVisible(!isVisible)}>
        <div className={s.formulaField}>
          <BlockMath>{fonudLatex}</BlockMath>
        </div>
        <span className={s.percentage} style={{ color: percentageColor }}>
          {percentage}%
        </span>
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
        <div className={s.text}>{fonudLatex}</div>
      </div>
      <div className={s.separator}>
        <Separator />
      </div>
    </div>
  );
};
