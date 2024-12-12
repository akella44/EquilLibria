import { ChangeEvent, FC } from "react";
import s from "./MathInput.module.css";
import { Keyboard } from "@assets/icons/Keyboard";
import { useRef } from "react";
import { keyboardStore } from "@/store/keyboard";

interface MathInputProps {
  onChange: (value: string) => void;
  value: string;
}

export const MathInput: FC<MathInputProps> = ({ onChange, value }) => {
  const { getIsKeyboardVisible, setIsKeyboardVisible } = keyboardStore;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={s.textareaWrapper}>
      <input
        autoFocus
        placeholder="x^2 + y^2 = r^2"
        className={s.textarea}
        value={value}
        onChange={handleInput}
        ref={inputRef}
      />
      <div
        className={s.keyboardButton}
        onClick={() => setIsKeyboardVisible(!getIsKeyboardVisible())}
      >
        <Keyboard />
      </div>
    </div>
  );
};
