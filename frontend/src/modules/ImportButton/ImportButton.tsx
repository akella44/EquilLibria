import { FC, useState } from "react";
import s from "./ImportButton.module.css";
import { Arrow } from "@/shared/assets/icons/Arrow";
import { Separator } from "@/shared/ui/Separator/Separator";

export const ImportButton: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={s.importButton}>
      <div className={s.header}>
        <h2 className={s.title}>Импорт</h2>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`${s.arrow} ${isOpen ? s.activeArrow : ""}`}
        >
          <Arrow />
        </div>
      </div>
      <div className={`${s.list} ${isOpen ? s.listActive : ""}`}>
        <Separator />
        <div className={s.listItem}>
          <span className={s.listItemText}>Имопрт из pdf</span>
        </div>
        <Separator />
        <div className={s.listItem}>
          <span className={s.listItemText}>Импорт по изображению</span>
        </div>
      </div>
    </div>
  );
};
