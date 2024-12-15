import { FC, useState } from "react";
import s from "./MyFormulasDetailed.module.css";
import { SearchBar } from "../SearchBar";
import { FormulaList } from "./FormulaList";
import { useFormulaList } from "@/entities/Formulas/useFormulaList/useFormulaList";

export const MyFormulasDetailed: FC = () => {
  const { data } = useFormulaList();

  const [query, setQuery] = useState<string>("");
  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().startsWith(query.toLowerCase())
  );

  return (
    <div className={s.myFormulasDetailed}>
      {data?.length ? (
        <>
          <div className={s.header}>
            <h1 className={s.title}>Мои формулы</h1>
            <SearchBar setQuery={setQuery} />
          </div>
          <FormulaList formulaList={filteredData} />
        </>
      ) : (
        <div className={s.header}>
          <h1 className={s.title}>Мои формулы</h1>
          <p className={s.text}>Вы пока не сохранили ни одной формулы</p>
        </div>
      )}
      {data?.length > 0 && filteredData?.length === 0 && (
        <div>
          <p className={s.text}>Формулы не найдены</p>
        </div>
      )}
    </div>
  );
};
