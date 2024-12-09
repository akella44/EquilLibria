import { type RouteObject } from "react-router-dom";
import { SignUp } from "@pages/SignUp";
import { PublicRoute } from "@components/PublicRoute";

export const signUpRoutes: RouteObject[] = [
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
];
