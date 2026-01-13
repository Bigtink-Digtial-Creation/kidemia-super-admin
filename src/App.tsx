import { createBrowserRouter, Navigate } from "react-router";
import { AuthRoutes, SidebarRoutes } from "./routes";

// Route Guards
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

// Layouts
import AuthLayout from "./layouts/Auth.layout";
import DashboardLayout from "./layouts/Dashboard.layout";

// Auth pages
import LoginPage from "./pages/Auth/Login";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ChangePasswordPage from "./pages/Auth/ChangePassword";
import SignUpPage from "./pages/Auth/SignUp";

// Dashboard pages
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import AssessmentPage from "./pages/Assessment";
import CreateAssessment from "./pages/Assessment/CreateAssessment";
import SingleAssessment from "./pages/Assessment/SingleAssessment";

import ErrorPage from "./pages/ErrorPage";
import UserManagementPage from "./pages/People";
import RolesPage from "./pages/Access";
import RoleDetailPage from "./pages/Access/role";
import SubjectsPage from "./pages/Content/subjects";
import SubjectDetailPage from "./pages/Content/subjects/SubjectDetailPage";
import TopicDetailPage from "./pages/Content/topics";
import QuestionCreationPage from "./pages/Content/questions/AddQuestions";
import TagsPage from "./pages/Content/tags";
import AssessmentCategoriesPage from "./pages/Content/categories";
import PlansPage from "./pages/Plans/plan";
import { CreatePlanPage } from "./pages/Plans/CreatePlanPage";
import { EditPlanPage } from "./pages/Plans/EditPlanPage";
import PromotionsPage from "./pages/Plans/promo";
import QuestionEditPage from "./pages/Content/questions/QuestionEditPage";
import BadgesPage from "./pages/Game/badge";
import MyProfileSettingsPage from "./pages/Profile/setting";
import PlatformSettingsPage from "./pages/Settings";
import ResetPasswordPage from "./pages/Auth/Password/ResetPassword";
import VerifyEmailPage from "./pages/Auth/Password/VerifyEmail";
import EmailVerificationRequiredPage from "./pages/Auth/Password/EmailVerificationRequired";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      // Public Routes (Auth)
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={AuthRoutes.login} replace />,
              },
              { path: AuthRoutes.login, element: <LoginPage /> },
              { path: AuthRoutes.forgotPassword, element: <ForgotPasswordPage /> },
              { path: AuthRoutes.changePassword, element: <ChangePasswordPage /> },
              { path: AuthRoutes.resetPassword, element: <ResetPasswordPage /> },
              { path: AuthRoutes.signup, element: <SignUpPage /> },
              { path: AuthRoutes.verifyEmail, element: <VerifyEmailPage /> },
            ],
          },
        ],
      },

      // Email Verification Required (Semi-protected - user logged in but not verified)
      {
        path: AuthRoutes.emailVerificationRequired,
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <EmailVerificationRequiredPage />,
          },
        ],
      },

      // Protected Routes (Dashboard)
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: SidebarRoutes.dashboard,
                element: <DashboardPage />,
              },
              {
                path: SidebarRoutes.users,
                element: <UserManagementPage />,
              },
              {
                path: SidebarRoutes.subjects,
                element: <SubjectsPage />,
              },
              {
                path: SidebarRoutes.singleSubject,
                element: <SubjectDetailPage />,
              },
              {
                path: SidebarRoutes.profile,
                element: <ProfilePage />,
              },
              {
                path: SidebarRoutes.profileSettings,
                element: <MyProfileSettingsPage />,
              },
              {
                path: SidebarRoutes.roles,
                element: <RolesPage />,
              },
              {
                path: SidebarRoutes.singleRole,
                element: <RoleDetailPage />,
              },
              {
                path: SidebarRoutes.singleTopic,
                element: <TopicDetailPage />,
              },
              {
                path: SidebarRoutes.addQuestionsSubject,
                element: <QuestionCreationPage />,
              },
              {
                path: SidebarRoutes.editQuestion,
                element: <QuestionEditPage />,
              },
              {
                path: SidebarRoutes.tag,
                element: <TagsPage />,
              },
              {
                path: SidebarRoutes.categories,
                element: <AssessmentCategoriesPage />,
              },
              {
                path: SidebarRoutes.assessment,
                element: <AssessmentPage />,
              },
              {
                path: SidebarRoutes.createAssessment,
                element: <CreateAssessment />,
              },
              {
                path: SidebarRoutes.singleAssessment,
                element: <SingleAssessment />,
              },
              {
                path: SidebarRoutes.plans,
                element: <PlansPage />,
              },
              {
                path: SidebarRoutes.createPlan,
                element: <CreatePlanPage />,
              },
              {
                path: SidebarRoutes.editPlan,
                element: <EditPlanPage />,
              },
              {
                path: SidebarRoutes.promo,
                element: <PromotionsPage />,
              },
              {
                path: SidebarRoutes.game,
                element: <BadgesPage />,
              },
              {
                path: SidebarRoutes.settings,
                element: <PlatformSettingsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);