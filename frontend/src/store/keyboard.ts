import { makeAutoObservable } from "mobx";

class Keyboard {
  isKeyboardVisible: boolean;

  constructor() {
    this.isKeyboardVisible = true;
    makeAutoObservable(this);
  }

  getIsKeyboardVisible = () => {
    return this.isKeyboardVisible;
  };

  setIsKeyboardVisible = (value: boolean) => {
    this.isKeyboardVisible = value;
  };
}

export const keyboardStore = new Keyboard();
