import { Minus } from "@/shared/assets/icons/Minus";
import { FC, useState } from "react";
import s from "./DescriptionItem.module.css";
import { inputValueStore } from "@/store/inputValue";

export const DescriptionItem: FC = ({ id, text, onDelete }) => {
  const [value, setValue] = useState<string>(text);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    inputValueStore.setLegends(
      inputValueStore
        .getLegends()
        .map((item, index) => (index === id ? newValue : item))
    );
  };

  return (
    <div className={s.descriptionItem}>
      <input
        autoFocus
        className={s.text}
        value={value}
        onChange={handleChange}
      />
      <div className={s.iconWrapper} onClick={() => onDelete(id)}>
        <Minus />
      </div>
    </div>
  );
};
