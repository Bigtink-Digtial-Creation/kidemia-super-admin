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
  roles: "/dashboard/roles",
  profile: "/dashboard/profile",
};

export type AuthRoutes = (typeof AuthRoutes)[keyof typeof AuthRoutes];
export type SidebarRoutes = (typeof SidebarRoutes)[keyof typeof SidebarRoutes];
