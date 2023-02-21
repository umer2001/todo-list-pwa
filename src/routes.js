import { Outlet, useRoutes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./Pages/Home";
import Setting from "./Pages/Setting";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Theme from "./Pages/Theme";
import withAuthenticationRequired from "./utils/withAuthenticationRequired";
import withoutAuthenticationRequired from "./utils/withoutAuthenticationRequired";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: withAuthenticationRequired(AppLayout),
      children: [
        { path: "/:action?", order: 10, element: <Home /> },
        { path: "setting", element: <Setting /> },
        { path: "theme", element: <Theme /> },
      ],
    },
    {
      path: "/",
      element: withoutAuthenticationRequired(Outlet),
      children: [
        { path: "sign-in", element: <SignIn /> },
        { path: "sign-up", element: <SignUp /> },
      ],
    },
  ]);
}
