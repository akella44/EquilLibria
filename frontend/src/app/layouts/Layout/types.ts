import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
  header?: JSX.Element;
  footer?: JSX.Element;
}
