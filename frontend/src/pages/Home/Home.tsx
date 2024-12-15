import { PageLayout } from "@app/layouts/PageLayout";
import { FC } from "react";
import s from "./Home.module.css";
import { inputValueStore } from "@/store/inputValue";
import { observer } from "mobx-react-lite";
import { MathInput } from "@modules/MathInput";
import { FormulaPreview } from "@modules/FormulaPreview/FormulaPreview";
import { Keyboard } from "@modules/Keyboard/Keyboard";
import { keyboardStore } from "@/store/keyboard";
import { MyFormulas } from "@/modules/MyFormulas";
import { ImportButton } from "@/modules/ImportButton/ImportButton";
import { Description } from "@/modules/Description";
import { editFormulaStore } from "@/store/editFormula";

export const Home: FC = observer(() => {
  const { getIsKeyboardVisible } = keyboardStore;

  const { inputValue, setValue } = inputValueStore;

  return (
    <PageLayout>
      <div className={s.homePage}>
        {!editFormulaStore.getIsEdit() && (
          <div className={s.importWrapper}>
            <ImportButton />
          </div>
        )}
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
        <div className={s.descriptionWrapper}>
          <Description />
        </div>
        {!editFormulaStore.getIsEdit() && (
          <div className={s.myFormulasWrapper}>
            <MyFormulas />
          </div>
        )}
      </div>
    </PageLayout>
  );
});
