import { FC, useEffect, useRef, useState } from "react";
import s from "./FormulaPreview.module.css";
import MathJax from "react-mathjax2";
import { inputValueStore } from "@/store/inputValue";
import { Plus } from "@/shared/assets/icons/Plus";
import { Separator } from "@/shared/ui/Separator/Separator";
import { Export } from "@/shared/assets/icons/Export/Export";
import { useAddFomula } from "@/entities/Formulas/useAddFormula/useAddFormula";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import asciimathToLatex from "asciimath-to-latex";
import { clearLatex } from "@/shared/lib/clearLatex";
import { latexOrAscii } from "@/shared/lib/latexOrAscii";
import { editFormulaStore } from "@/store/editFormula";
import { Save } from "@/shared/assets/icons/Save/Save";
import { useUpdateFomula } from "@/entities/Formulas/useUpdateFormula";
import { useNavigate } from "react-router-dom";
import { exportModalStore } from "@/store/exportModal";
import { ExportModal } from "../ExportModal";
import { observer } from "mobx-react-lite";

interface IFormulaPreview {
  value: string;
}

export const FormulaPreview: FC<IFormulaPreview> = observer(({ value }) => {
  const [formualName, setFormualName] = useState("Формула");
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  const blockMathRef = useRef(null);
  const asciiMathRef = useRef(null);

  const { updateFormula } = useUpdateFomula();

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

  const router = useNavigate();

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
            {inputValueStore.getFormulaName() || " "}
          </span>
          <input
            placeholder="Название"
            ref={inputRef}
            type="text"
            value={inputValueStore.getFormulaName()}
            onChange={handleChange}
          />
        </div>
        <div className={s.formulaField}>
          {inputValueStore.getValueType() === "ascii" ? (
            <div ref={asciiMathRef}>
              <MathJax.Context input="ascii">
                <MathJax.Node>{value}</MathJax.Node>
              </MathJax.Context>
            </div>
          ) : (
            <div ref={blockMathRef}>
              <BlockMath>{clearLatex(value)}</BlockMath>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${s.functions} ${
          ((latexOrAscii(inputValueStore.getValue()) === "latex" &&
            clearLatex(inputValueStore.getValue())) ||
            (inputValueStore.getValue() &&
              latexOrAscii(inputValueStore.getValue()) === "ascii")) &&
          inputValueStore.getFormulaName()
            ? s.visible
            : ""
        }`}
      >
        <div className={s.separator}>
          <Separator />
        </div>
        <div className={s.iconsWrapper}>
          <div className={s.iconWrapper}>
            {editFormulaStore.getIsEdit() ? (
              <div
                onClick={() => {
                  updateFormula(editFormulaStore.getFormulaId(), {
                    content:
                      latexOrAscii(inputValueStore.getValue()) === "latex"
                        ? clearLatex(inputValueStore.getValue())
                        : asciimathToLatex(inputValueStore.getValue()),
                    name: inputValueStore.getFormulaName(),
                    legends: inputValueStore
                      .getLegends()
                      .filter((item) => item != ""),
                    description: "",
                  });
                  inputValueStore.clear();
                  editFormulaStore.clear();
                  router("/myformulas");
                }}
              >
                <Save />
              </div>
            ) : (
              <div
                onClick={() => {
                  addFormula({
                    content:
                      latexOrAscii(inputValueStore.getValue()) === "latex"
                        ? clearLatex(inputValueStore.getValue())
                        : asciimathToLatex(inputValueStore.getValue()),
                    name: inputValueStore.getFormulaName(),
                    legends: inputValueStore
                      .getLegends()
                      .filter((item) => item != ""),
                    description: "",
                  });
                }}
              >
                <Plus />
              </div>
            )}
          </div>
          <div
            className={s.iconWrapper}
            onClick={() =>
              exportModalStore.setIsModalVisible(
                !exportModalStore.getIsModalVisible()
              )
            }
          >
            <Export />
            {exportModalStore.getIsModalVisible() && (
              <div className={s.exportModalWrapper}>
                <ExportModal
                  blockRef={blockMathRef}
                  asciiMathRef={asciiMathRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
