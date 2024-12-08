import { createBrowserRouter } from "react-router-dom";
import { homeRoutes } from "./routes/home";
import { notFoundRoute } from "./routes/notFound";
import { signInRoutes } from "./routes/signIn";
import { signUpRoutes } from "./routes/signUp";
import { analyzeRoutes } from "./routes/analyze";
import { myFormulasRoutes } from "./routes/myFormulas/myFormulas";

export const router = createBrowserRouter([
  ...homeRoutes,
  ...notFoundRoute,
  ...signInRoutes,
  ...signUpRoutes,
  ...analyzeRoutes,
  ...myFormulasRoutes,
]);
