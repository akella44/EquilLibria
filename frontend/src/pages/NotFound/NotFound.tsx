import { PageLayout } from "@/app/layouts/PageLayout";
import { FC } from "react";

export const NotFound: FC = () => {
  return (
    <PageLayout>
      <h1 style={{ padding: "40px" }}>404 - Page Not Found</h1>
    </PageLayout>
  );
};
