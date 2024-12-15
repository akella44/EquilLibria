import { PageLayout } from "@app/layouts/PageLayout";
import { FC, useState } from "react";
import s from "./Analyze.module.css";
import { inputValueStore } from "@/store/inputValue";
import { observer } from "mobx-react-lite";
import { MathInput } from "@modules/MathInput";
import { FormulaPreview } from "@modules/FormulaPreview/FormulaPreview";
import { Keyboard } from "@modules/Keyboard/Keyboard";
import { keyboardStore } from "@/store/keyboard";
// import { MyFormulas } from "@/modules/MyFormulas";
import { AnalyzeButton } from "@/modules/AnalyzeButton";
import { ImportButton } from "@/modules/ImportButton/ImportButton";
import { AnalyzeResults } from "@/modules/AnalyzeResults/AnalyzeResults";
import {
  getSemanticSimilarFormulasByLatex,
  getStaticSimilarFormulasByLatex,
} from "@/shared/api/formulasService/formulasController";
import asciimathToLatex from "asciimath-to-latex";

export const Analyze: FC = observer(() => {
  const { getIsKeyboardVisible } = keyboardStore;
  const { inputValue, setValue } = inputValueStore;

  const [staticList, setStaticList] = useState([]);

  return (
    <PageLayout>
      <div className={s.analyzePage}>
        <div className={s.importWrapper}>
          <ImportButton />
        </div>
        <div className={s.mathInputWrapper}>
          <MathInput onChange={setValue} value={inputValue} />
        </div>
        <div
          className={`${s.keyboardWrapper} ${
            getIsKeyboardVisible() ? s.visible : ""
          }`}
        >
          <Keyboard />
        </div>
        <div className={s.formulaPreviewWrapper}>
          <FormulaPreview value={inputValue} />
        </div>
        <div
          onClick={() => {
            getStaticSimilarFormulasByLatex(
              inputValueStore.getValueType() === "ascii"
                ? asciimathToLatex(inputValueStore.getValue())
                : inputValueStore.getValue()
            ).then((data) => console.log(data));
            getSemanticSimilarFormulasByLatex(
              inputValueStore.getValueType() === "ascii"
                ? asciimathToLatex(inputValueStore.getValue())
                : inputValueStore.getValue()
            ).then((data) => console.log(data));
          }}
          className={s.analyzeButton}
        >
          <AnalyzeButton />
        </div>
        <div className={s.analyzeResultsWrapper}>
          <AnalyzeResults />
        </div>
      </div>
    </PageLayout>
  );
});
