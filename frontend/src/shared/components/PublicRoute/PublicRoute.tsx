import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute: FC<PropsWithChildren> = ({ children }) => {
  if (localStorage.getItem("accessToken")) {
    return <Navigate to="/" />;
  }
  return children;
};
