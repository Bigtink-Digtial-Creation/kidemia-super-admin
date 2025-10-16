import { NavLink, useLocation } from "react-router";
import { Link } from "@heroui/react";
import type { SidebarLinkT } from "./sidebarLink";

type SidebarPropsT = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
};

export default function SidebarLink(
  props: SidebarPropsT & Omit<SidebarLinkT, "allowedRoles">,
) {
  const Icon = props.icon;
  const location = useLocation();

  const exactLocation =
    props.pathname.split("/").length > 2
      ? location.pathname === props.pathname ||
      location.pathname.includes(props.pathname)
      : props.pathname === "/dashboard" &&
      location.pathname.split("/").length === 2;

  const closeSidebar = () => {
    if (props.sidebarOpen) {
      props.setSidebarOpen(false);
    }
  };
  return (
    <Link
      as={NavLink}
      to={props.pathname}
      end={true}
      onClick={closeSidebar}
      className={`z-10 group relative flex w-full items-center gap-2 rounded-md py-2 px-4 font-medium duration-400 ease-in-out transition-width text-kidemia-black2  hover:bg-kidemia-primary hover:text-kidemia-white ${exactLocation ? "text-kidemia-white bg-kidemia-primary" : ""
        }`}
    >
      {Icon && (
        <Icon
          width={4}
          height={4}
          className={`text-xl text-center  ${exactLocation && "text-kidemia-white"
            }`}
        />
      )}
      <div
        className={`font-medium text-base animate-sidebar-text-show   ${exactLocation ? "text-kidemia-white" : ""
          }`}
      >
        {props.title}
      </div>
    </Link>
  );
}
