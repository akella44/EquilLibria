import { FC } from "react";
import s from "./DescriptionList.module.css";
import { Separator } from "@/shared/ui/Separator/Separator";
import { Plus } from "@/shared/assets/icons/Plus";
import { DescriptionItem } from "../DescriptionItem";
import { inputValueStore } from "@/store/inputValue";
import { observer } from "mobx-react-lite";

export const DescriptionList: FC = observer(() => {
  const onDelete = (id: number) => {
    inputValueStore.setLegends(
      [...inputValueStore.getLegends()].filter((_, index) => index !== id)
    );
  };

  return (
    <div>
      {inputValueStore.getLegends()?.length > 0 &&
        inputValueStore.getLegends().map((item, index) => (
          <div className={s.wrapper}>
            <DescriptionItem id={index} onDelete={onDelete} text={item} />
            <Separator />
          </div>
        ))}
      <div className={s.descriptionItem}>
        <div
          className={s.iconWrapper}
          onClick={() => {
            inputValueStore.setLegends([...inputValueStore.getLegends(), ""]);
          }}
        >
          <Plus />
        </div>
      </div>
    </div>
  );
});
