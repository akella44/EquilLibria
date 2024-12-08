import { FC } from "react";
import { Layout } from "../Layout";
import { PageLayoutWithoutHeaderProps } from "./types";
import s from "./PageLayoutWithoutHeader.module.css";

export const PageLayoutWithoutHeader: FC<PageLayoutWithoutHeaderProps> = ({
  children,
  ...props
}) => {
  return (
    <Layout {...props}>
      <div className={s.container}>{children}</div>
    </Layout>
  );
};
