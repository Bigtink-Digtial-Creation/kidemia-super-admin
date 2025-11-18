import type { IconType } from "react-icons";
import { SidebarRoutes } from "../../routes";
import {
  MdOutlineDashboard,
  MdOutlineTopic,
  MdAssessment,
} from "react-icons/md";
import { PiBooksBold } from "react-icons/pi";
import { SiPrivateinternetaccess } from "react-icons/si";
import { GoPasskeyFill } from "react-icons/go";

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
    title: "Topics",
    icon: MdOutlineTopic,
    pathname: SidebarRoutes.topics,
  },
  {
    title: "Roles",
    icon: SiPrivateinternetaccess,
    pathname: SidebarRoutes.roles,
  },
  {
    title: "Permissions",
    icon: GoPasskeyFill,
    pathname: SidebarRoutes.permissions,
  },
  {
    title: "Assessment",
    icon: MdAssessment,
    pathname: SidebarRoutes.assessment,
  },
];