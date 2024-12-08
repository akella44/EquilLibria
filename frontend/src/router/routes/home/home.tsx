import { type RouteObject } from "react-router-dom";
import { Home } from "@pages/Home";
import { PrivateRoute } from "@/shared/components/PrivateRoute";

export const homeRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
];
