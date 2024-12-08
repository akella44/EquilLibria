import { FC } from "react";
import { KeyboardButton } from "../KeyboardButton/KeyboardButton";
import s from "./KeyboardButtonList.module.css";
import { inputValueStore } from "@/store/inputValue";

export const KeyboardButtonList: FC = ({ keyboardButonList }) => {
  const { setValue, getValue, resetValue } = inputValueStore;

  const handleClick = (value: string) => {
    if (value === "clr") {
      resetValue();
      return;
    }
    if (value === "back") {
      setValue(getValue().slice(0, -1));
      return;
    }
    setValue(getValue() + value);
  };

  return (
    <ul className={s.keyboardButonList}>
      {keyboardButonList.map((button) => (
        <li
          className={s.keyboardButon}
          onClick={() => handleClick(button.value)}
        >
          <KeyboardButton value={button.value} variant={button.variant} />
        </li>
      ))}
    </ul>
  );
};
