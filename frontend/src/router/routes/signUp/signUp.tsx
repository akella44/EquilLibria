import { type RouteObject } from "react-router-dom";
import { SignUp } from "@pages/SignUp";

export const signUpRoutes: RouteObject[] = [
  {
    path: "/signup",
    element: <SignUp />,
  },
];
