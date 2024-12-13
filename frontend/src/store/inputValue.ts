import { latexOrAscii } from "@/shared/lib/latexOrAscii";
import { makeAutoObservable } from "mobx";

class InputValue {
  inputValue: string;
  valueType: "ascii" | "latex";
  fomulaName: string;

  constructor() {
    this.inputValue = "";
    this.valueType = "ascii";
    this.fomulaName = "Формула";
    makeAutoObservable(this);
  }

  resetValue = () => {
    this.inputValue = "";
  };

  getValue = () => {
    return this.inputValue;
  };

  setValue = (value: string) => {
    if (latexOrAscii(value) === "latex") this.valueType = "latex";
    if (latexOrAscii(value) === "ascii") this.valueType = "ascii";
    this.inputValue = value;
  };

  getValueType = () => {
    return this.valueType;
  };

  setFormulaName = (value: string) => {
    this.fomulaName = value;
  };

  getFormulaName = () => {
    return this.fomulaName;
  };
}

export const inputValueStore = new InputValue();
