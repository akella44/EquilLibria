import { FC } from "react";
import { LayoutProps } from "./types";
import s from "./Layout.module.css";

export const Layout: FC<LayoutProps> = ({ children, header, footer }) => {
  return (
    <div className={s.layout}>
      {header && header}
      {children}
      {footer && footer}
    </div>
  );
};
