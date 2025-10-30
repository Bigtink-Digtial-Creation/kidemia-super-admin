import { createBrowserRouter, Navigate } from "react-router";
import { AuthRoutes, SidebarRoutes } from "./routes";

//layouts
import AuthLayout from "./layouts/Auth.layout";
import DashboardLayout from "./layouts/Dashboard.layout";

//auth
import LoginPage from "./pages/Auth/Login";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ChangePasswordPage from "./pages/Auth/ChangePassword";
import SignUpPage from "./pages/Auth/SignUp";

//dashboard
import DashboardPage from "./pages/Dashboard";
import SubjectsPage from "./pages/Subjects";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import RolesPage from "./pages/Roles";
import SingleRoles from "./pages/Roles/SingleRoles";
import PermissionsPage from "./pages/Permissions";
import SingleSubject from "./pages/Subjects/SingleSubject";
import TopicsPage from "./pages/Topics";

import ErrorPage from "./pages/ErrorPage";
import SingleTopic from "./pages/Topics/SingleTopic";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    path: "/",
    children: [
      {
        index: true,
        element: <Navigate to={AuthRoutes.login} replace />,
      },
      { path: AuthRoutes.login, element: <LoginPage /> },
      { path: AuthRoutes.forgotPassword, element: <ForgotPasswordPage /> },
      { path: AuthRoutes.changePassword, element: <ChangePasswordPage /> },
      { path: AuthRoutes.signup, element: <SignUpPage /> },
    ],
  },
  {
    path: SidebarRoutes.dashboard,
    element: <DashboardLayout />,
    children: [
      {
        path: SidebarRoutes.dashboard,
        element: <DashboardPage />,
      },
      {
        path: SidebarRoutes.subjects,
        element: <SubjectsPage />,
      },
      {
        path: SidebarRoutes.singleSubject,
        element: <SingleSubject />,
      },
      {
        path: SidebarRoutes.profile,
        element: <ProfilePage />,
      },
      {
        path: SidebarRoutes.settings,
        element: <SettingsPage />,
      },
      {
        path: SidebarRoutes.roles,
        element: <RolesPage />,
      },
      {
        path: SidebarRoutes.singleRole,
        element: <SingleRoles />,
      },
      {
        path: SidebarRoutes.permissions,
        element: <PermissionsPage />,
      },
      {
        path: SidebarRoutes.topics,
        element: <TopicsPage />,
      },
      {
        path: SidebarRoutes.singleTopic,
        element: <SingleTopic />,
      },
    ],
  },
]);
