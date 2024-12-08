import { type FC, type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthToken } from "@hooks/useAuthToken";

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { getAccessToken } = useAuthToken();

  if (!getAccessToken()) {
    return <Navigate to="sign-in" />;
  }

  return children;
};
