import type { IconType } from "react-icons";
import { SidebarRoutes } from "../../routes";
import {
  MdOutlineDashboard,
  MdAssessment,
  MdPeople,
  MdSchool,
} from "react-icons/md";
import { PiBooksBold } from "react-icons/pi";
import { SiPrivateinternetaccess } from "react-icons/si";
import { CreditCard, Gamepad2 } from "lucide-react";

export type SidebarActionT = {
  label: string;
  path: string;
};


export type SidebarLinkT = {
  title: string;
  subText?: string;
  icon: IconType;
  pathname: SidebarRoutes;
  actions?: SidebarActionT[];
};

export const sidebarLinks: SidebarLinkT[] = [
  {
    title: "Dashboard",
    icon: MdOutlineDashboard,
    pathname: SidebarRoutes.dashboard,
  },
  {
    title: "Manage Assessment",
    icon: MdAssessment,
    pathname: SidebarRoutes.assessment,
  },
  {
    title: "Manage Content",
    icon: PiBooksBold,
    pathname: SidebarRoutes.subjects,
    actions: [
      {
        label: "Subjects",
        path: SidebarRoutes.subjects,
      },
      {
        label: "Category",
        path: SidebarRoutes.categories,
      },
      {
        label: "Tags",
        path: SidebarRoutes.tag,
      },
    ],
  },
  {
    title: "Manage Users",
    icon: MdPeople,
    pathname: SidebarRoutes.users,
  },

  {
    title: "Manage Schools",
    icon: MdSchool,
    pathname: SidebarRoutes.institution,
  },
  {
    title: "Gamification",
    icon: Gamepad2,
    pathname: SidebarRoutes.game,

  },

  {
    title: "Manage Subscription",
    icon: CreditCard,
    pathname: SidebarRoutes.plans,
  },
  {
    title: "Manage Access",
    icon: SiPrivateinternetaccess,
    pathname: SidebarRoutes.roles,
  },

];