import { type StorageInstance } from "./types";

export const useStorage = (instance: StorageInstance) => {
  const getValue = (name: string) => {
    return instance.getItem(name);
  };

  const setValue = (name: string, value: string | number) => {
    instance.setItem(name, value.toString());
  };

  const removeValue = (name: string) => {
    instance.removeItem(name);
  };

  return { getValue, setValue, removeValue };
};
