import { makeAutoObservable } from "mobx";

class UserStore {
  username = localStorage.getItem("username") || "";

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username: string) {
    this.username = username;
    localStorage.setItem("username", username);
  }
}

export const userStore = new UserStore();
