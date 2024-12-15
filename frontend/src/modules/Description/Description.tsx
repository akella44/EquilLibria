import { FC } from "react";
import { DescriptionList } from "./DescriptionList";
import s from "./Description.module.css";
import { Pen } from "@/shared/assets/icons/Pen/Pen";
import { Separator } from "@/shared/ui/Separator/Separator";

export const Description: FC = () => {
  return (
    <div className={s.description}>
      <div className={s.header}>
        <h2 className={s.title}>Описание</h2>
        <button className={s.ai}>AI</button>
      </div>
      <Separator />
      <DescriptionList />
    </div>
  );
};
