import { FC, useState, useEffect, useRef } from "react";
import { IFomulaItem } from "../types";
import s from "./MyFormulasItem.module.css";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { inputValueStore } from "@/store/inputValue";
import { Export } from "./Export";

export const MyFormulasItem: FC<IFomulaItem> = ({ name, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const mathRef = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={s.formulaItem}
      onClick={() => {
        inputValueStore.setFormulaName(name);
        inputValueStore.setValue(content);
      }}
    >
      <div className={s.header}>
        <span className={s.title}>{name}</span>
        {isOpen && (
          <div
            className={s.modal}
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <Export mathRef={mathRef} latex={content} />
          </div>
        )}

        <span
          className={s.export}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          Экспортировать
        </span>
      </div>
      <div className={s.formula}>
        <div className={s.formulaInline} ref={mathRef}>
          <BlockMath>{content}</BlockMath>
        </div>
      </div>
    </div>
  );
};
