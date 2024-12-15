import { FC } from "react";
import { Layout } from "../Layout";
import { PageLayoutProps } from "./types";
import s from "./PageLayout.module.css";
import { Sidebar } from "@/modules/Sidebar";
import { importModalStore } from "@/store/importModal";
import { ImportModal } from "@/modules/ImportModal";
import { observer } from "mobx-react-lite";

export const PageLayout: FC<PageLayoutProps> = observer(
  ({ children, ...props }) => {
    return (
      <Layout {...props}>
        {importModalStore.getIsModalVisible() && <ImportModal />}
        <div className={s.container}>
          <div className={s.sidebarWrapper}>
            <Sidebar />
          </div>
          <div className={s.content}>{children}</div>
        </div>
      </Layout>
    );
  }
);
