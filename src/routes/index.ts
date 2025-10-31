export const AuthRoutes = {
  login: "/auth/login",
  signup: "/auth/signup",
  forgotPassword: "/auth/forgot-password",
  changePassword: "/auth/change-password",
};

export const SidebarRoutes = {
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  subjects: "/dashboard/subjects",
  singleSubject: "/dashboard/subjects/:id",
  roles: "/dashboard/roles",
  singleRole: "/dashboard/roles/:id",
  profile: "/dashboard/profile",
  permissions: "/dashboard/permissions",
  topics: "/dashboard/topics",
  singleTopic: "/dashboard/topics/:id",
  bulkTopic: "/dashboard/topics/bulk/:id",
};

export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes];
export type SidebarRoutes = (typeof SidebarRoutes)[keyof typeof SidebarRoutes];
