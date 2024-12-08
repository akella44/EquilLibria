import { makeAutoObservable } from "mobx";

class InputValue {
  inputValue: string;

  constructor() {
    this.inputValue = "";
    makeAutoObservable(this);
  }

  resetValue = () => {
    this.inputValue = "";
  };

  getValue = () => {
    return this.inputValue
  }

  setValue = (value: string) => {
    this.inputValue = value;
  };
}

export const inputValueStore = new InputValue();
