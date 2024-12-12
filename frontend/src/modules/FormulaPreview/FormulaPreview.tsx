import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import s from "./FormulaPreview.module.css";
import MathJax from "react-mathjax2";
import { inputValueStore } from "@/store/inputValue";
import { Plus } from "@/shared/assets/icons/Plus";
import { Separator } from "@/shared/ui/Separator/Separator";
import { Export } from "@/shared/assets/icons/Export/Export";
import { useAddFomula } from "@/entities/Formulas/useAddFormula";

interface IFormulaPreview {
  value: string;
}

export const FormulaPreview: FC<IFormulaPreview> = ({ value }) => {
  const [formualName, setFormualName] = useState("Формула");
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  const { addFormula } = useAddFomula();

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 20}px`;
    }
  }, [formualName]);

  const handleChange = (e) => {
    setFormualName(e.target.value);
    console.log(Ivalue);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.textareaWrapper}>
        <div className={s.formulaName}>
          <span
            ref={spanRef}
            style={{
              visibility: "hidden",
              whiteSpace: "pre",
              position: "absolute",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            {formualName || " "}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={formualName}
            onChange={handleChange}
          />
        </div>
        <div className={s.formulaField}>
          <MathJax.Context input="ascii">
            <div>
              <MathJax.Node>{value}</MathJax.Node>
            </div>
          </MathJax.Context>
        </div>
      </div>
      <div className={s.separator}>
        <Separator />
      </div>
      <div className={s.iconsWrapper}>
        <div className={s.iconWrapper} onClick={() => addFormula()}>
          <Plus />
        </div>
        <div className={s.iconWrapper}>
          <Export />
        </div>
      </div>
    </div>
  );
};
