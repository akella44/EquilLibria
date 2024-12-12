import { makeAutoObservable } from "mobx";

class InputValue {
  inputValue: string;
  fomulaName: string;

  constructor() {
    this.inputValue = "";
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
    this.inputValue = value;
  };

  setFormulaName = (value: string) => {
    this.fomulaName = value;
  };

  getFormulaName = () => {
    return this.fomulaName;
  };
}

export const inputValueStore = new InputValue();
