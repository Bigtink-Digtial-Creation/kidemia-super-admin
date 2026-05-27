import { OpenAPI, type RoleType, type UserListResponse, } from "../sdk/generated";

export const getNameIntials = (name: string) => {
  if (!name) return null;

  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2);
  } else {
    return nameParts
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2);
  }
};

export const getFullName = (user: UserListResponse) => {
  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");
};

export const getFullName2 = (user: any) => {
  return [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ");
};
export const getUserStatus = (isActive: boolean) => {
  return isActive ? "active" : "suspended";
};

export const getStatusBadgeColor = (isActive: boolean) => {
  return isActive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
};


export const getAssessmentStatusColor = (status: string) => {
  const colors: Record<string, "success" | "warning" | "danger" | "default" | "primary"> = {
    published: "success",
    draft: "default",
    review: "warning",
    scheduled: "primary",
    archived: "danger",
  };
  return colors[status] || "default";
};

export const getRoleBadgeColor = (roleType?: RoleType) => {
  switch (roleType) {
    case "system":
      return "bg-purple-100 text-purple-800";
    case "institution":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};




export const formatDateToDDMMYYYY = (isoDate: string | Date | null | undefined): string => {
  // date to dd-mm-yyy
  if (!isoDate) return "Not set";
  const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getChipColor = (action: string) => {
  switch (action?.toLowerCase()) {
    case "create":
      return "success";
    case "read":
      return "primary";
    case "update":
      return "warning";
    case "delete":
      return "danger";
    default:
      return "secondary";
  }
};

export const getDifficultyColor = (action: string) => {
  switch (action?.toLowerCase()) {
    case "easy":
      return "success";
    case "medium":
      return "primary";
    case "expert":
      return "warning";
    case "hard":
      return "danger";
    default:
      return "secondary";
  }
};

export const toTitleCase = (str: string) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());


// Helper to get current auth headers from the SDK config
export const getAuthHeaders = async () => {

  const mockOptions = {
    method: 'POST',
    url: '/api/v1/auth/me',
  };
  const token = typeof OpenAPI.TOKEN === 'function'
    ? await OpenAPI.TOKEN(mockOptions as any)
    : OpenAPI.TOKEN;

  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};


export const generatePassword = (length = 8) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*()_+";
  const all = letters + digits + special;

  // Guarantee at least one digit
  let pass = digits.charAt(Math.floor(Math.random() * digits.length));

  for (let i = 1; i < length; i++) {
    pass += all.charAt(Math.floor(Math.random() * all.length));
  }

  // Shuffle so the guaranteed digit isn't always first
  return pass.split("").sort(() => Math.random() - 0.5).join("");
};

export function formatDate(iso: string): { absolute: string; relative: string } {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffDays / 365.25);

  let relative: string;
  if (diffDays < 1) relative = "Today";
  else if (diffDays === 1) relative = "Yesterday";
  else if (diffDays < 7) relative = `${diffDays}d ago`;
  else if (diffDays < 30) relative = `${diffWeeks}w ago`;
  else if (diffMonths < 12) relative = `${diffMonths}mo ago`;
  else relative = `${diffYears}yr${diffYears > 1 ? "s" : ""} ago`;

  const absolute = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return { absolute, relative };
}