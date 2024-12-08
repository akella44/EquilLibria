import { type RouteObject } from "react-router-dom";
import { PrivateRoute } from "@/shared/components/PrivateRoute";
import { MyFormulas } from "@/pages/MyFormulas";

export const myFormulasRoutes: RouteObject[] = [
  {
    path: "/myformulas",
    element: (
      <PrivateRoute>
        <MyFormulas />
      </PrivateRoute>
    ),
  },
];
