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
  assessmentAttempts: "assessmentAttempts",
  attemptDetail: "attemptDetail",

  assessmentLeaderboard: "assessmentLeaderboard",

  plans: "plans",
  singlePlan: "singlePlan",
  promotions: "promotions",
  features: "features",

  badges: "badges",

  // Finance / Misc
  currencies: "currencies",
  dashboardStats: "dashboardStats",
  dashboardAnalytics: "dashboardAnalytics",
  reportDashboard: "reportDashboard",
  institutions: "institutions",
  platformSettings: "platformSettings",
  singleSetting: "singleSetting",
  settingByKey: "settingByKey",
  settingCategories: "settingCategories",
} as const;



export const institutionKeys = {
  all: (id: string) => ["institution", id] as const,
  students: (id: string) => ["institution", id, "students"] as const,
  teachers: (id: string) => ["institution", id, "teachers"] as const,
  classrooms: (id: string) => ["institution", id, "classrooms"] as const,
  classroomStudents: (institutionId: string, classroomId: string) =>
    ["institution", institutionId, "classrooms", classroomId, "students"] as const,
  classroomGroups: (institutionId: string, classroomId: string) =>
    ["institution", institutionId, "classrooms", classroomId, "groups"] as const,
  groups: (id: string) => ["institution", id, "groups"] as const,
  assessments: (id: string) => ["institution", id, "assessments"] as const,
  analytics: (id: string) => ["institution", id, "analytics"] as const,
  settings: (id: string) => ["institution", id, "settings"] as const,
};