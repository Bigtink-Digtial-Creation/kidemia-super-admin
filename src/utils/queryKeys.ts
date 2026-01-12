export const QueryKeys = {
  // User / Auth
  user: "user",
  users: "users",
  userDetails: "user-details",
  userRoles: "user-roles",

  // Roles & Permissions
  roles: "roles",
  singleRole: "singleRole",
  customRole: "customRole",
  systemRole: "sytemRole",
  permissions: "permissions",
  permissionId: "permissionId",

  // Subjects & Topics
  subjects: "subjects",
  singleSubject: "singleSubject",
  subjectTopics: "subjectTopics",
  topicById: "topicById",

  // Questions
  questions: "questions",
  questionsById: "questionsById",
  questionDetails: "questionDetails",
  tags: "tags",

  // Assessments
  allAssessment: "allAssessment",
  singleAssessment: "singleAssessment",
  assessmentCategories: "assessmentCategories",

  plans: "plans",
  singlePlan: "singlePlan",
  promotions: "promotions",
  features: "features",

  badges: "badges",

  // Finance / Misc
  currencies: "currencies",
  dashboardStats: "dashboardStats",
  dashboardAnalytics: "dashboardAnalytics",

  platformSettings: "platformSettings",
  singleSetting: "singleSetting",
  settingByKey: "settingByKey",
  settingCategories: "settingCategories",
} as const;
