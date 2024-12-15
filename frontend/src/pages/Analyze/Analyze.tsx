import { PageLayout } from "@app/layouts/PageLayout";
import { FC, useEffect, useState } from "react";
import s from "./Analyze.module.css";
import { inputValueStore } from "@/store/inputValue";
import { observer } from "mobx-react-lite";
import { MathInput } from "@modules/MathInput";
import { FormulaPreview } from "@modules/FormulaPreview/FormulaPreview";
import { Keyboard } from "@modules/Keyboard/Keyboard";
import { keyboardStore } from "@/store/keyboard";
import { AnalyzeButton } from "@/modules/AnalyzeButton";
import { ImportButton } from "@/modules/ImportButton/ImportButton";
import { AnalyzeResults } from "@/modules/AnalyzeResults/AnalyzeResults";
import {
  getSemanticSimilarFormulasByLatex,
  getStaticSimilarFormulasByLatex,
} from "@/shared/api/formulasService/formulasController";
import asciimathToLatex from "asciimath-to-latex";
import { Loader } from "@/shared/ui/Loader";

export const Analyze: FC = observer(() => {
  const { getIsKeyboardVisible } = keyboardStore;
  const { inputValue, setValue } = inputValueStore;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [semanticList, setSemanticList] = useState([{}]);
  const [staticList, setStaticList] = useState([
    {
      legends: ["f(x)", "g(x)", "h(x)"],
      description:
        "This expression represents the composition of three functions f, g, and h.",
      found_latex: "f(g(h(x))) = 2h(x) + 3g(x) - 1",
      subexpressions: ["f(g(h(x)))", "h(x)", "g(x)"],
      original_latex: "f(g(h(x))) = h(x)",
    },
    {
      legends: ["a", "b", "c", "d"],
      description: "This equation describes a cubic polynomial relationship.",
      found_latex: "ax^3 + bx^2 + cx + d - 7 = 0",
      subexpressions: ["ax^3", "bx^2", "cx", "d"],
      original_latex: "ax^3 + bx^2 + cx + d = 0",
    },
    {
      legends: ["\u03B1", "\u03B2", "\u03B3", "R"],
      description:
        "This expression represents the law of cosines extended for spherical triangles.",
      found_latex: "R^2 = a^2 + b^2 - 2ab cos(\theta) + 4",
      subexpressions: ["R^2", "a^2", "b^2", "cos(\theta)"],
      original_latex: "R^2 = a^2 + b^2 - 2ab cos(\theta)",
    },
    {
      legends: ["x", "y", "k"],
      description:
        "This expression represents the parametric equations of a conic section.",
      found_latex: "x(t) = h + r cos(t) + 2, ; y(t) = k + r sin(t) - 1",
      subexpressions: ["x(t)", "y(t)", "cos(t)", "sin(t)"],
      original_latex: "x(t) = h + r cos(t), ; y(t) = k + r sin(t)",
    },
    {
      legends: ["\u03B5", "t", "N_0", "k"],
      description: "This represents a modified exponential growth model.",
      found_latex: "N(t) = N_0 e^{kt} - 5 + \frac{1}{2}",
      subexpressions: ["N(t)", "N_0", "e^{kt}"],
      original_latex: "N(t) = N_0 e^{kt}",
    },
  ]);

  // useEffect(() => {
  //   if (staticList.length > 0) {
  //     const updatedList = semanticList.map((item) => ({
  //       ...item,
  //       originalLatex:
  //         inputValueStore.getValueType() === "ascii"
  //           ? asciimathToLatex(inputValueStore.getValue())
  //           : inputValueStore.getValue(),
  //     }));
  //     setStaticList(updatedList);
  //   }
  // }, [staticList]);

  const analyze = async () => {
    setIsLoading(true);

    try {
      const latexValue =
        inputValueStore.getValueType() === "ascii"
          ? asciimathToLatex(inputValueStore.getValue())
          : inputValueStore.getValue();

      const [staticData, semanticData] = await Promise.all([
        getStaticSimilarFormulasByLatex(latexValue),
        getSemanticSimilarFormulasByLatex(latexValue),
      ]);

      console.log(staticData);
      console.log(semanticData);
    } catch (error) {
      console.error("Error fetching formulas:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div onClick={() => analyze()} className={s.analyzeButton}>
          <AnalyzeButton />
        </div>
        {isLoading && <Loader />}
        {staticList.length > 0 && (
          <div className={s.analyzeResultsWrapper}>
            <AnalyzeResults
              staticList={staticList}
              semanticList={semanticList}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
});
