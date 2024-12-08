import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import s from "./FormulaPreview.module.css";
import MathJax from "react-mathjax2";

interface IFormulaPreview {
  value: string;
}

export const FormulaPreview: FC<IFormulaPreview> = ({ value }) => {
  const [formualName, setValue] = useState("Формула");
  const spanRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 20}px`;
    }
  }, [formualName]);

  const handleChange = (e) => {
    setValue(e.target.value);
    console.log(Ivalue);
  };

  return (
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
  );
};
