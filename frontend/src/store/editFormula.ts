import { makeAutoObservable } from "mobx";

class EditFormula {
  formulaId: number;
  isEdit: boolean;

  constructor() {
    this.formulaId = 0;
    this.isEdit = false;
    makeAutoObservable(this);
  }

  getFormulaId = () => {
    return this.formulaId;
  };

  setFormulaId = (id: number) => {
    this.formulaId = id;
  };

  getIsEdit = () => {
    return this.isEdit;
  };

  setIsEdit = (isEdit: boolean) => {
    this.isEdit = isEdit;
  };

  clear = () => {
    this.formulaId = 0;
    this.isEdit = false;
  };
}

export const editFormulaStore = new EditFormula();
