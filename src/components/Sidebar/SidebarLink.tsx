import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { Link } from "@heroui/react";
import { MdChevronRight } from "react-icons/md";
import type { SidebarLinkT } from "./sidebarLink";

type SidebarPropsT = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
};

export default function SidebarLink(props: SidebarPropsT & SidebarLinkT) {
  const {
    icon: Icon,
    pathname,
    title,
    subText,
    actions,
    setSidebarOpen,
  } = props;

  const location = useLocation();

  /** Active when parent route OR any action route matches */
  const isParentActive =
    location.pathname.startsWith(pathname) ||
    (actions?.some((a) => location.pathname.startsWith(a.path)) ?? false);

  const [isOpen, setIsOpen] = useState(isParentActive);

  useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [location.pathname, isParentActive]);

  const handleParentClick = (e: React.MouseEvent) => {
    if (actions && actions.length > 0) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
  };

  return (
    <div className="w-full">
      <Link
        as={NavLink}
        to={actions?.length ? location.pathname : pathname}
        onClick={handleParentClick}
        className={`group relative flex w-full items-center justify-between rounded-md py-2 px-4 font-normal transition-all duration-300
          ${isParentActive
            ? "bg-kidemia-primary text-kidemia-white"
            : "text-kidemia-black2 hover:bg-kidemia-primary hover:text-kidemia-white"
          }`}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon
              className={`text-xl ${isParentActive ? "text-white" : ""}`}
            />
          )}

          <div className="flex flex-col leading-tight">
            <span className="text-base">{title}</span>
            {subText && (
              <span
                className={`text-xs ${isParentActive ? "text-white/80" : "text-gray-500"}`}
              >
                {subText}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        {actions && actions.length > 0 && (
          <MdChevronRight
            className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          />
        )}
      </Link>

      {/* Dropdown Actions */}
      {actions && actions.length > 0 && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="ml-6 mt-1 flex flex-col gap-1">
            {actions.map((action) => {
              const isActionActive = location.pathname === action.path;

              return (
                <Link
                  key={action.path}
                  as={NavLink}
                  to={action.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`rounded-md px-4 py-2 text-sm transition-all duration-200
                    ${isActionActive
                      ? "bg-kidemia-primary/20 text-kidemia-primary font-medium"
                      : "text-gray-600 hover:bg-kidemia-primary/10 hover:text-kidemia-primary"
                    }`}
                >
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}