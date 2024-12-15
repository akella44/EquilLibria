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

  const sl = [
    {
      legends: ["f(x)", "g(x)", "h(x)", "k(x)"],
      description:
        "A complex functional relationship involving several functions and their derivatives.",
      found_latex:
        "f(g(x)) + \\frac{d}{dx}(h(x)k(x)) - \\int_0^x f(t)dt = 5 \\cdot h(x) + 10",
      percentage: 95,
    },
    {
      legends: ["a", "b", "c", "x", "y", "z"],
      description: "A general cubic polynomial equation in three variables.",
      found_latex: "a x^3 + b y^2 z + c \\frac{x y}{z} + \\frac{1}{a+b} = 0",
      percentage: 90,
    },
    {
      legends: ["A", "B", "C", "D"],
      description: "An expanded series representation of a function.",
      found_latex:
        "\\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\epsilon = A + Bx + Cx^2 + Dx^3 + \\dots",
      percentage: 88,
    },
    {
      legends: ["x", "y", "z", "w", "a", "b", "c", "d"],
      description: "A complex matrix operation with variables.",
      found_latex:
        "\\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = \\begin{bmatrix} ax+by & bx+dy \\\\ az+cw & bz+dw \\end{bmatrix}",
      percentage: 92,
    },
    {
      legends: ["m", "t", "k", "g", "A", "\u03C9", "\u03B8"],
      description: "A complex differential equation of a damped oscillation.",
      found_latex:
        "m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x =  A \\cos(\\omega t)",
      percentage: 97,
    },
    {
      legends: ["\u03A3", "n", "i", "j", "m", "S"],
      description: "A double sum formula.",
      found_latex: "\\sum_{i=1}^{n} \\sum_{j=1}^{m} (i^2 + j^2) =  S",
      percentage: 93,
    },
    {
      legends: ["A", "B", "C", "D", "\u03B8", "a", "b", "c"],
      description: "The complex Law of Cosines with additional terms.",
      found_latex: "c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta)",
      percentage: 96,
    },
    {
      legends: ["\u03A8", "x", "t", "m", "\u03C9", "h", "v", "x", "y"],
      description:
        "The time-dependent Schrödinger equation with complex components.",
      found_latex:
        "i\\hbar\\frac{\\partial \\Psi(x,t)}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t)",
      percentage: 91,
    },
    {
      legends: ["\u03A8", "x", "t", "m", "\u03C9", "h", "v", "x", "y"],
      description:
        "The time-dependent Schrödinger equation with complex components.",
      found_latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      percentage: 93,
    },
    {
      legends: ["p", "q", "r"],
      description: "The general quadratic formula.",
      found_latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      percentage: 90,
    },
  ];

  const stl = [
    {
      legends: ["f(x)", "g(x)", "h(x)", "k(x)"],
      description:
        "This represents a complex functional relationship involving several functions and their derivatives.",
      found_latex: "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c}",
      subexpressions: ["x^{2}", "a", "b + c"],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      legends: ["a", "b", "c", "x", "y", "z"],
      description:
        "This represents a general cubic polynomial equation in three variables.",
      found_latex: "a + b + c + x + y + z = a x^3 + b y^2 z + c \\frac{x y}{z}",
      subexpressions: ["a", "b", "c", "x", "y", "z"],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      legends: ["x", "y", "z", "a", "b", "c"],
      description: "This represents a complex matrix operation with variables.",
      found_latex:
        "\\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = \\begin{bmatrix} ax+by & bx+dy \\\\ az+cw & bz+dw \\end{bmatrix}",
      subexpressions: [
        "\\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix}",
        "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
      ],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      legends: ["Σ", "n", "i", "j"],
      description: "This formula represents a double sum",
      found_latex:
        "\\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c = \\sum_{i=1}^{n} \\sum_{j=1}^{m} (i^2 + j^2)",
      subexpressions: ["\\sum_{i=1}^{n}", "\\sum_{j=1}^{m}", "i", "j", "n"],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      found_latex: "\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}",
      subexpressions: ["\\sum_{i=1}^{n}", "i", "n"],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} i^2 + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      found_latex: "e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)",
      subexpressions: [
        "e^{i\\theta}",
        "\\cos(\\theta)",
        "\\sin(\\theta)",
        "i",
        "theta",
      ],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      found_latex: "\\frac{d}{dx} \\left( x^n \\right) = n x^{n-1}",
      subexpressions: ["\\frac{d}{dx}", "x", "n"],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      found_latex: "\\int_{a}^{b} f(x)dx = F(b) - F(a)",
      subexpressions: ["\\int_{a}^{b}", "f(x)", "F(x)", "a", "b"],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      found_latex: "e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)",
      subexpressions: [
        "e^{i\\theta}",
        "\\cos(\\theta)",
        "\\sin(\\theta)",
        "i",
        "\\theta",
      ],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
    {
      found_latex: "\\lim_{x \\to a} f(x) = L",
      subexpressions: ["\\lim_{x \\to a}", "f(x)", "L", "a"],
      original_latex:
        "f(x) + g(x) + h(x) + k(x) = \\frac{x^{2} + a}{b + c} + a + b + c + d + x^{2} + \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n + \\begin{bmatrix} x & y \\\\ z & w \\end{bmatrix} + \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} + m \\frac{d^2x}{dt^2} + k \\frac{dx}{dt} + g x + \\sum_{i=1}^{n} + \\sum_{j=1}^{m} + c + A + B + C + 5 = c^2 = a^2 + b^2 - 2ab \\cdot \\cos(\\theta) + i\\hbar + \\frac{\\partial \\Psi(x,t)}{\\partial t} + \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) + x = \\frac{-b + p + q + r}{2a} + A(t) + A_0 + e^{\\lambda t} + \\int_0^t f(t)dt = 0",
    },
  ];

  const [semanticList, setSemanticList] = useState();
  const [staticList, setStaticList] = useState();

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
      setSemanticList(sl);
      setStaticList(stl);
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
        <div
          style={{ zIndex: "900" }}
          onClick={() => analyze()}
          className={s.analyzeButton}
        >
          <AnalyzeButton />
        </div>
        {isLoading && <Loader />}
        {staticList?.length > 0 && semanticList?.length > 0 && (
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
