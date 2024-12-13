import { FC, ReactNode } from "react";
import s from "./IconWrapper.module.css";

interface IconWrapperProps {
  children: ReactNode;
  padding?: string;
}

export const IconWrapper: FC<IconWrapperProps> = ({
  children,
  padding = "6px",
}) => {
  return (
    <div className={s.iconWrapper} style={{ padding: padding }}>
      {children}
    </div>
  );
};
