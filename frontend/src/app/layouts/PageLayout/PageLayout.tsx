import { FC } from "react";
import { Layout } from "../Layout";
import { PageLayoutProps } from "./types";
import s from "./PageLayout.module.css";
import { Sidebar } from "@/modules/Sidebar";

export const PageLayout: FC<PageLayoutProps> = ({ children, ...props }) => {
  return (
    <Layout {...props}>
      <div className={s.container}>
        <div className={s.sidebarWrapper}>
          <Sidebar />
        </div>
        <div className={s.content}>{children}</div>
      </div>
    </Layout>
  );
};
