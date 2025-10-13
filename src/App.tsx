import { createBrowserRouter, Navigate } from "react-router";
import { AuthRoutes } from "./routes";


import AuthLayout from "./layouts/Auth.layout";

import LoginPage from "./pages/Auth/Login";

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
      {path:AuthRoutes.login, element:<LoginPage/>}
    ]
  }
])