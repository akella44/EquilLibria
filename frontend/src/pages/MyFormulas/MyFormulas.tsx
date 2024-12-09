import { PageLayout } from "@/app/layouts/PageLayout";
import { MyFormulasDetailed } from "@/modules/MyFormulasDetailed";
import { FC } from "react";

export const MyFormulas: FC = () => {
  return (
    <PageLayout>
      <MyFormulasDetailed />
    </PageLayout>
  );
};
