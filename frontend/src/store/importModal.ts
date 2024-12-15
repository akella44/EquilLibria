import { makeAutoObservable } from "mobx";

class ImportModal {
  isModalVisible: boolean;
  file: File | null;
  isRequest: boolean;
  type: "img" | "pdf";

  constructor() {
    this.isModalVisible = false;
    this.file = null;
    this.isRequest = false;
    this.type = "img";
    makeAutoObservable(this);
  }

  getType = () => {
    return this.type;
  };

  setType = (value: "img" | "pdf") => {
    this.type = value;
  };

  getIsRequest = () => {
    return this.isRequest;
  };

  setIsRequest = (value: boolean) => {
    this.isRequest = value;
  };

  getFile = () => {
    return this.file;
  };

  setFile = (file: File | null) => {
    this.file = file;
  };

  getIsModalVisible = () => {
    return this.isModalVisible;
  };

  setIsModalVisible = (value: boolean) => {
    this.isModalVisible = value;
  };

  clear = () => {
    this.isModalVisible = false;
    this.file = null;
  };
}

export const importModalStore = new ImportModal();
