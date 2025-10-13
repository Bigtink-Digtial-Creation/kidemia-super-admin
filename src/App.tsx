import { createBrowserRouter, Navigate } from "react-router";
import { AuthRoutes } from "./routes";

//layouts
import AuthLayout from "./layouts/Auth.layout";

//auth
import LoginPage from "./pages/Auth/Login";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";

import ErrorPage from "./pages/ErrorPage";


export const  router = createBrowserRouter([
  {
    element:<AuthLayout/>,
    errorElement:<ErrorPage/>,
    path:"/",
    children:[
      {
        index: true,
        element: <Navigate to={AuthRoutes.login} replace />,
      },
      { path: AuthRoutes.login, element: <LoginPage /> },
      { path: AuthRoutes.forgotPassword, element: <ForgotPasswordPage /> }
    ]
  }
])