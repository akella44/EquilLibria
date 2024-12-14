import { latexOrAscii } from "@/shared/lib/latexOrAscii";
import { makeAutoObservable } from "mobx";

class InputValue {
  inputValue: string;
  valueType: "ascii" | "latex";
  fomulaName: string;
  legends: string[];

  constructor() {
    this.inputValue = "";
    this.valueType = "ascii";
    this.fomulaName = "Формула";
    this.legends = [];
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

  setLegends = (legends: string[]) => {
    this.legends = legends;
  };

  getLegends = () => {
    return this.legends;
  };

  clear = () => {
    this.inputValue = "";
    this.valueType = "ascii";
    this.fomulaName = "Формула";
    this.legends = [];
  };
}

export const inputValueStore = new InputValue();
