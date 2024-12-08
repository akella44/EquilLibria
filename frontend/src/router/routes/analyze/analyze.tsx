import { type RouteObject } from "react-router-dom";
import { Analyze } from "@pages/Analyze";
import { PrivateRoute } from "@shared/components/PrivateRoute";

export const analyzeRoutes: RouteObject[] = [
  {
    path: "/analyze",
    element: (
      <PrivateRoute>
        <Analyze />
      </PrivateRoute>
    ),
  },
];
