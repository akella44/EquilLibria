import { FC } from "react";
import s from './FormError.module.css'

interface IFormError {
  text: string;
}

export const FormError: FC<IFormError> = ({ text }) => {
  return <span className={s.error}>{text}</span>;
};
