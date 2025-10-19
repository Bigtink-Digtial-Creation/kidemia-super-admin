import type { IconType } from "react-icons";
import { SidebarRoutes } from "../../routes";
import { MdManageHistory, MdOutlineDashboard } from "react-icons/md";
import { CgPerformance } from "react-icons/cg";
import { PiBooksBold } from "react-icons/pi";

export type SidebarLinkT = {
  title: string;
  icon: IconType;
  pathname: SidebarRoutes;
};

export const sidebarLinks: SidebarLinkT[] = [
  {
    title: "Dashboard",
    icon: MdOutlineDashboard,
    pathname: SidebarRoutes.dashboard,
  },
  {
    title: "Subjects",
    icon: PiBooksBold,
    pathname: SidebarRoutes.subjects,
  },
  {
    title: "Performance",
    icon: CgPerformance,
    pathname: SidebarRoutes.performance,
  },
  {
    title: "History",
    icon: MdManageHistory,
    pathname: SidebarRoutes.history,
  },
];
