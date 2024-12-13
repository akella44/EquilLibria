import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import s from "./FormulaPreview.module.css";
import MathJax from "react-mathjax2";
import { inputValueStore } from "@/store/inputValue";
import { Plus } from "@/shared/assets/icons/Plus";
import { Separator } from "@/shared/ui/Separator/Separator";
import { Export } from "@/shared/assets/icons/Export/Export";
import { useAddFomula } from "@/entities/Formulas/useAddFormula/useAddFormula";
import { BlockMath } from "react-katex";
import asciimathToLatex from "asciimath-to-latex";
import { clearLatex } from "@/shared/lib/clearLatex";
import { latexOrAscii } from "@/shared/lib/latexOrAscii";
import { validateLatex } from "@/shared/lib/validateLatex";

interface IFormulaPreview {
  value: string;
}

console.log(
  validateLatex(
    "[ int_{a}^{b} left( sum_{n=1}^{infty} \frac{(-1)^{n+1}}{n^2} \right) e^{x^2} , dx = \frac{pi^2}{6} cdot left( \frac{d^2}{dx^2} left( int_{0}^{x} sin(t) , dt \right) \right) \bigg|_{x=0} ]"
  )
);

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
    inputValueStore.setFormulaName(e.target.value);
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
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            {formualName || " "}
          </span>
          <input
            placeholder="Название"
            ref={inputRef}
            type="text"
            value={formualName}
            onChange={handleChange}
          />
        </div>
        <div className={s.formulaField}>
          {inputValueStore.getValueType() === "ascii" ? (
            <MathJax.Context input="ascii">
              <MathJax.Node>{value}</MathJax.Node>
            </MathJax.Context>
          ) : (
            <BlockMath>{clearLatex(value)}</BlockMath>
          )}
        </div>
      </div>
      <div
        className={`${s.functions} ${
          inputValueStore.getValue() && inputValueStore.getFormulaName()
            ? s.visible
            : ""
        }`}
      >
        <div className={s.separator}>
          <Separator />
        </div>
        <div className={s.iconsWrapper}>
          <div
            className={s.iconWrapper}
            onClick={() =>
              addFormula({
                content:
                  latexOrAscii(inputValueStore.getValue()) === "latex"
                    ? clearLatex(inputValueStore.getValue())
                    : asciimathToLatex(inputValueStore.getValue()),
                name: inputValueStore.getFormulaName(),
                legends: ["asd"],
                description: "asd",
              })
            }
          >
            <Plus />
          </div>
          <div className={s.iconWrapper}>
            <Export />
          </div>
        </div>
      </div>
    </div>
  );
};
