import { FC } from "react";
import { Search } from "@/shared/assets/icons/Search";
import s from "./SearchBar.module.css";

export const SearchBar: FC = () => {
  return (
    <div className={s.searchWrapper}>
      <input className={s.input} />
      <div className={s.iconWrapper}>
        <Search />
      </div>
    </div>
  );
};
