import { makeAutoObservable } from "mobx";

class ExportModal {
  isModalVisible: boolean;

  constructor() {
    this.isModalVisible = false;
    makeAutoObservable(this);
  }

  getIsModalVisible = () => {
    return this.isModalVisible;
  };

  setIsModalVisible = (value: boolean) => {
    this.isModalVisible = value;
  };

  clear = () => {
    this.isModalVisible = false;
  };
}

export const exportModalStore = new ExportModal();
