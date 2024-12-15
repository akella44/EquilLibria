import { PageLayout } from "@/app/layouts/PageLayout";
import { ImportButton } from "@/modules/ImportButton/ImportButton";
import { MyFormulasDetailed } from "@/modules/MyFormulasDetailed";
import { FC } from "react";
import s from "./MyFormulas.module.css";

export const MyFormulas: FC = () => {
  return (
    <PageLayout>
      <div className={s.import}>
        <ImportButton />
      </div>
      <MyFormulasDetailed />
    </PageLayout>
  );
};
