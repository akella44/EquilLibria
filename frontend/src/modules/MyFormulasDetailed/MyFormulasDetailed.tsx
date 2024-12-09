import { FC } from "react";
import s from "./MyFormulasDetailed.module.css";
import { SearchBar } from "../SearchBar";

export const MyFormulasDetailed: FC = () => {
  return (
    <div className={s.myFormulasDetailed}>
      <h1 className={s.title}>Мои формулы</h1>
      <SearchBar />
    </div>
  );
};
