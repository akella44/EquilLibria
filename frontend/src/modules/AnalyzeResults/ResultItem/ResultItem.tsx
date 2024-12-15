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
      <div className={s.header}>
        <div>
          <BlockMath>{`\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}\\frac{1}{2}`}</BlockMath>
        </div>
        <div className={`${s.content} ${isVisible ? s.visible : ""}`}>
          <EmptyArrow />
        </div>
      </div>
      <div className={s.content}>
        <h3 className={s.title}>Оригинал</h3>
        <span className={s.text}>asdasdasdasdasdsd</span>
        <h3 className={s.title}>Найденная формула</h3>
        <span className={s.text}>qweqweqweqweqweqwe</span>
      </div>
      <Separator />
    </div>
  );
};
