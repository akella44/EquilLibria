import { FC } from "react";
import { KeyboardButtonList } from "./KeyboardButtonList";
import { keyboardButtonList } from "./constants";
import s from './Keyboard.module.css'

export const Keyboard: FC = () => {
  return (
    <div className={s.keyboard}>
      <KeyboardButtonList keyboardButonList={keyboardButtonList} />
    </div>
  );
};
