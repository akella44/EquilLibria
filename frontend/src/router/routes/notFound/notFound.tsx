import { type RouteObject } from "react-router-dom";
import { NotFound } from "@pages/NotFound";
import { PrivateRoute } from "@/shared/components/PrivateRoute";

export const notFoundRoute: RouteObject[] = [
  {
    path: "*",
    element: (
      <PrivateRoute>
        <NotFound />
      </PrivateRoute>
    ),
  },
];
