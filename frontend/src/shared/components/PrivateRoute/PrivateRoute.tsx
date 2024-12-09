import { type FC, type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  if (!localStorage.getItem("accessToken")) {
    return <Navigate to="signin" />;
  }
  return children;
};
