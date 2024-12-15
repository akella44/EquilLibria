import { FC, useState } from "react";
import s from "./ResultItem.module.css";
import { EmptyArrow } from "@/shared/assets/icons/EmptyArrow/EmptyArrow";
import { BlockMath } from "react-katex";
import { Separator } from "@/shared/ui/Separator/Separator";

interface ResultItemProps {
  latex: string;
}

export const ResultItem: FC<ResultItemProps> = ({ latex }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={s.resultItem}>
      <div className={s.header} onClick={() => setIsVisible(!isVisible)}>
        <div className={s.formulaField}>
          <BlockMath>{`\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}`}</BlockMath>
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
          <span className={s.text}>asdasdasdasdasdsd</span>
        </div>
        <div>
          <h3 className={s.title}>Найденная формула</h3>
          <span className={s.text}>qweqweqweqweqweqwe</span>
        </div>
      </div>
      <div className={s.separator}>
        <Separator />
      </div>
    </div>
  );
};
