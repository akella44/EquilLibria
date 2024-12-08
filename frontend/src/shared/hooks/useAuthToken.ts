import { useLocalStorage } from "@hooks/useLocalStorage";

export const useAuthToken = () => {
  const { setValue, getValue, removeValue } = useLocalStorage();

  const removeAccessToken = () => {
    removeValue("token");
  };

  const addAccessToken = (token: string) => {
    setValue("token", token);
  };

  const getAccessToken = () => {
    return getValue("token");
  };

  return {
    addAccessToken,
    getAccessToken,
    removeAccessToken,
  };
};
