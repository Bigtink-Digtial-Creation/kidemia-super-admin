import { createBrowserRouter, Navigate } from "react-router";
import { AuthRoutes, SidebarRoutes } from "./routes";

// Route Guards
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { RoleRoute } from "./components/RoleRoute";
import { InstitutionRoute } from "./components/InstitutionRoute";

// Layouts
import AuthLayout from "./layouts/Auth.layout";
import DashboardLayout from "./layouts/Dashboard.layout";

// Auth pages
import LoginPage from "./pages/Auth/Login";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ChangePasswordPage from "./pages/Auth/ChangePassword";
import SignUpPage from "./pages/Auth/SignUp";
import ResetPasswordPage from "./pages/Auth/Password/ResetPassword";
import VerifyEmailPage from "./pages/Auth/Password/VerifyEmail";
import EmailVerificationRequiredPage from "./pages/Auth/Password/EmailVerificationRequired";
import UnauthorizedPage from "./pages/Auth/unauthorized";

// Platform dashboard pages
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import MyProfileSettingsPage from "./pages/Profile/setting";
import UserManagementPage from "./pages/People";
import RolesPage from "./pages/Access";
import RoleDetailPage from "./pages/Access/role";
import SubjectsPage from "./pages/Content/subjects";
import SubjectDetailPage from "./pages/Content/subjects/SubjectDetailPage";
import TopicDetailPage from "./pages/Content/topics";
import QuestionCreationPage from "./pages/Content/questions/AddQuestions";
import QuestionEditPage from "./pages/Content/questions/QuestionEditPage";
import TagsPage from "./pages/Content/tags";
import AssessmentCategoriesPage from "./pages/Content/categories";
import AssessmentPage from "./pages/Assessment";
import CreateAssessment from "./pages/Assessment/CreateAssessment";
import SingleAssessment from "./pages/Assessment/SingleAssessment";
import AttemptDetail from "./pages/Assessment/AttemptDetail";
import PlansPage from "./pages/Plans/plan";
import { CreatePlanPage } from "./pages/Plans/CreatePlanPage";
import { EditPlanPage } from "./pages/Plans/EditPlanPage";
import PromotionsPage from "./pages/Plans/promo";
import BadgesPage from "./pages/Game/badge";
import PlatformSettingsPage from "./pages/Settings";
import AnalyticsDashboard from "./pages/Analytic/AnalyticsDashboard";
import ReportGenerator from "./pages/Analytic/Reportgenerator";
import AdminInstitutionManager from "./pages/Institution/AdminManger";

// Institution pages
import InstitutionDashboard from "./pages/Institution/dashboard";

import ErrorPage from "./pages/ErrorPage";
import CreateInstitutionAssessment from "./pages/Institution/CreateInstitutionAssessment";
import AssessmentDetailPage from "./pages/Institution/AssessmentDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [

      // ── Standalone pages (no layout, no auth) ──────────────────
      {
        path: AuthRoutes.unauthorized,
        element: <UnauthorizedPage />,
      },

      // ── Public Routes (Auth) ────────────────────────────────────
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

      // ── Semi-protected (logged in but email not verified) ───────
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

      // ── All authenticated routes ────────────────────────────────
      {
        element: <ProtectedRoute />,
        children: [

          // ── Platform dashboard 
          {
            element: <DashboardLayout />,
            children: [

              // Shared — any authenticated platform user
              { path: SidebarRoutes.dashboard, element: <DashboardPage /> },
              { path: SidebarRoutes.profile, element: <ProfilePage /> },
              { path: SidebarRoutes.profileSettings, element: <MyProfileSettingsPage /> },

              // Content management — permission based (covers custom roles too)
              {
                element: <RoleRoute requiredPermission="content:create" />,
                children: [
                  { path: SidebarRoutes.subjects, element: <SubjectsPage /> },
                  { path: SidebarRoutes.singleSubject, element: <SubjectDetailPage /> },
                  { path: SidebarRoutes.singleTopic, element: <TopicDetailPage /> },
                  { path: SidebarRoutes.addQuestionsSubject, element: <QuestionCreationPage /> },
                  { path: SidebarRoutes.editQuestion, element: <QuestionEditPage /> },
                  { path: SidebarRoutes.tag, element: <TagsPage /> },
                  { path: SidebarRoutes.categories, element: <AssessmentCategoriesPage /> },
                ],
              },

              // Assessment management — permission based
              {
                element: <RoleRoute requiredPermission="assessment:manage" />,
                children: [
                  { path: SidebarRoutes.assessment, element: <AssessmentPage /> },
                  { path: SidebarRoutes.createAssessment, element: <CreateAssessment /> },
                  { path: SidebarRoutes.singleAssessment, element: <SingleAssessment /> },
                  { path: SidebarRoutes.assessmentAttempt, element: <AttemptDetail /> },
                ],
              },

              // Administrator only
              {
                element: <RoleRoute allowedRoles={["super_admin", 'school_manager']} />,
                children: [
                  { path: SidebarRoutes.users, element: <UserManagementPage /> },
                  { path: SidebarRoutes.roles, element: <RolesPage /> },
                  { path: SidebarRoutes.singleRole, element: <RoleDetailPage /> },
                  { path: SidebarRoutes.plans, element: <PlansPage /> },
                  { path: SidebarRoutes.createPlan, element: <CreatePlanPage /> },
                  { path: SidebarRoutes.editPlan, element: <EditPlanPage /> },
                  { path: SidebarRoutes.promo, element: <PromotionsPage /> },
                  { path: SidebarRoutes.game, element: <BadgesPage /> },
                  { path: SidebarRoutes.institution, element: <AdminInstitutionManager /> },
                  { path: SidebarRoutes.settings, element: <PlatformSettingsPage /> },
                  { path: SidebarRoutes.reportAnalytic, element: <AnalyticsDashboard /> },
                  { path: SidebarRoutes.generateReport, element: <ReportGenerator /> },
                ],
              },

            ],
          },

          {
            path: "institution/:institutionId",
            element: <InstitutionRoute />,
            children: [
              { path: "dashboard", element: <InstitutionDashboard />, },
              { path: "assessments/create", element: <CreateInstitutionAssessment /> },
              { path: "assessments/:assessmentId", element: <AssessmentDetailPage />, },
              { path: 'profile', element: <ProfilePage /> },

            ],
          }

        ],
      },

    ],
  },
]);