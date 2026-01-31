import type { RoleType, UserListResponse, } from "../sdk/generated";

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
