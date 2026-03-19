export const AuthRoutes = {
  login: "/auth/login",
  signup: "/auth/signup",
  forgotPassword: "/auth/forgot-password",
  changePassword: "/auth/change-password",
  resetPassword: "/auth/reset-password",
  verifyEmail: "/auth/verify-email",
  emailVerificationRequired: "/auth/email-verification-required",
  unauthorized: "/auth/unauthorized",
};

export const SidebarRoutes = {
  dashboard: "/dashboard",
  profile: "/dashboard/profile",
  profileSettings: "/dashboard/profile/settings",
  settings: "/dashboard/settings",
  subjects: "/content/subjects",
  singleSubject: "/content/subjects/:id",
  addQuestionsSubject: "/content/subjects/:id/add-questions",
  editQuestion: "/content/subjects/:id/edit-questions",
  topics: "/content/topics",
  singleTopic: "/content/subjects/:subjectId/topics/:topicId",
  bulkTopic: "/content/topics/bulk/:id",

  tag: "/content/tag",

  assessment: "/content/assessment",
  createAssessment: "/content/assessment/create",
  singleAssessment: "/content/assessment/:id",
  assessmentAttempt: "/content/assessment/attempt/:id",
  categories: "/content/category",

  roles: "/platform/manage/roles",
  singleRole: "/platform/manage/roles/:id",

  // sub
  plans: "/platform/plans",
  createPlan: "/platform/plan/add-plan",
  promo: "/platform/plans/promo",
  editPlan: "/platform/plans/:id",

  game: "/platform/game/badges",
  // people
  users: "/people/users",

  reportAnalytic: "/platform/report/analytics",
  generateReport: "/platform/report/generate",

  institution: "/institution",
};

export const InstitutionRoutes = {
  dashboard: "/institution/:institutionId/dashboard",
  profile: "/institution/profile",
  settings: "/institution/settings",

};

export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes];
export type SidebarRoutes = (typeof SidebarRoutes)[keyof typeof SidebarRoutes];
export type InstitutionRoutes = (typeof InstitutionRoutes)[keyof typeof InstitutionRoutes];

export const buildRoute = (
  template: string,
  params: Record<string, string | number>
) =>
  Object.entries(params).reduce(
    (path, [key, value]) =>
      path.replace(`:${key}`, encodeURIComponent(String(value))),
    template
  );
