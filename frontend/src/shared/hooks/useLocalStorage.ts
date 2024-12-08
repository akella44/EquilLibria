import { useStorage } from '@/shared/hooks/useStorage/useStorage';

export const useLocalStorage = () => {
  const { getValue, setValue, removeValue } = useStorage(localStorage);

  return { getValue, setValue, removeValue };
};