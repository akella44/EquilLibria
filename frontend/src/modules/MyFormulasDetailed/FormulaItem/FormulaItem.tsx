import { FC } from "react";
import { DetailedFormulaItem } from "./types";
import s from "./FormulaItem.module.css";
import { Button } from "@shared/ui/Button";
import { Bin } from "@shared/assets/icons/Bin";
import { BlockMath } from "react-katex";
import { useDeleteFormula } from "@/entities/Formulas/useDeleteFormula";
import { Pen } from "@/shared/assets/icons/Pen/Pen";
import { editFormulaStore } from "@/store/editFormula";
import { useNavigate } from "react-router-dom";
import { inputValueStore } from "@/store/inputValue";

export const FormulaItem: FC<DetailedFormulaItem> = ({
  id,
  name,
  content,
  description,
  legends,
}) => {
  const { deleteFormula } = useDeleteFormula();

  const router = useNavigate();
  return (
    <div className={s.formulaItem}>
      <div className={s.header}>
        <h2 className={s.title}>{name}</h2>
        <div className={s.headerRight}>
          <Button variant="purple" text="Экспорт" fontSize={20} />
          <div
            className={s.iconWrapper}
            style={{ marginLeft: "5px" }}
            onClick={() => {
              editFormulaStore.setIsEdit(true);
              editFormulaStore.setFormulaId(id);
              router("/");
              inputValueStore.setFormulaName(name);
              inputValueStore.setLegends(legends);
              inputValueStore.setValue(content);
            }}
          >
            <Pen padding="10px" />
          </div>
          <div className={s.iconWrapper} onClick={() => deleteFormula(id)}>
            <Bin />
          </div>
        </div>
      </div>
      <div className={s.formula}>
        <BlockMath>{content}</BlockMath>
      </div>
      {legends.length > 0 && (
        <div className={s.description}>
          {legends?.map((string, index) => (
            <p key={index} className={s.desctiptionItem}>
              {string}
            </p>
          ))}
          {description}
        </div>
      )}
    </div>
  );
};
