import { type RouteObject } from "react-router-dom";
import { SignIn } from "@pages/SignIn";
import { PublicRoute } from "@components/PublicRoute";

export const signInRoutes: RouteObject[] = [
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
];
