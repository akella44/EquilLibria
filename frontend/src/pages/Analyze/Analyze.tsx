import { PageLayout } from "@app/layouts/PageLayout";
import { FC } from "react";
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

export const Analyze: FC = observer(() => {
  const { getIsKeyboardVisible } = keyboardStore;

  const { inputValue, setValue } = inputValueStore;

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
        <AnalyzeButton />
        <div className={s.analyzeResultsWrapper}>
          <AnalyzeResults />
        </div>
      </div>
    </PageLayout>
  );
});
