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

export const formatDateToDDMMYYYY = (isoDate: string | Date): string => {
  // date to dd-mm-yyy
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
