import { FC } from "react";
import s from "./Loader.module.css";

export const Loader: FC = () => {
  return (
    <div className={s.loader}>
      <div className={s.spinner}></div>
    </div>
  );
};
