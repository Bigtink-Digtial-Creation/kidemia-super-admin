import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Image,
  ScrollShadow,
  useDisclosure,
} from "@heroui/react";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { SidebarRoutes } from "../../routes";
import { FiLogOut, FiSettings } from "react-icons/fi";
import AppLogo from "@/assets/appLogo.png";
import LogoutModal from "./LogoutModal";
import { sidebarLinks } from "./sidebarLink";
import SidebarLink from "./SidebarLink";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [focused, setFocused] = useState<string | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const logout = useDisclosure();

  const closeSidebar = useCallback(
    () => setSidebarOpen(false),
    [setSidebarOpen],
  );

  useEffect(() => {
    const clickOutsideHandler = ({ target }: MouseEvent) => {
      if (
        sidebarOpen &&
        !sidebarRef.current?.contains(target as Node) &&
        !triggerRef.current?.contains(target as Node) &&
        !backdropRef.current?.contains(target as Node)
      ) {
        closeSidebar();
      }
    };

    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (sidebarOpen && keyCode === 27) {
        closeSidebar();
      }
    };

    document.addEventListener("click", clickOutsideHandler);
    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("click", clickOutsideHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [sidebarOpen, closeSidebar]);

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (sidebarOpen && keyCode === 27) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", keyHandler);

    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40"
          onClick={() => closeSidebar()}
        ></div>
      )}
      <aside
        ref={sidebarRef}
        className={`w-2xs absolute left-0 top-0 z-50 flex flex-col items-start justify-start overflow-y-clip bg-[#f5f6fa]/30 shadow-md transition-transform duration-300 ease-linear dark:bg-dark lg:static lg:translate-x-0 h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full flex justify-start">
          <div className="w-full flex  items-center justify-between px-6 py-4">
            <NavLink
              to={SidebarRoutes.dashboard}
              className="animate-sidebar-text-show"
            >
              <Image src={AppLogo} alt="Logo" width={80} />
            </NavLink>
          </div>
        </div>

        <div className="w-full flex flex-col overflow-y-auto duration-300 ease-linear">
          <ScrollShadow hideScrollBar={true} as={"nav"} className="p-4">
            <div
              className="overflow-x-hidden w-full"
              onMouseLeave={() => setFocused("")}
            >
              <ul className="flex flex-col space-y-3">
                {sidebarLinks.map((link) => {
                  // if (user && link?.allowedRoles.includes(user.role)) {
                  return (
                    <li
                      key={link.pathname}
                      onMouseEnter={() => setFocused(link.title)}
                      className="group relative"
                    >
                      <SidebarLink
                        pathname={link.pathname}
                        title={link.title}
                        icon={link.icon}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={closeSidebar}
                      />
                      {focused === link.title ? (
                        <motion.div
                          transition={{
                            layout: {
                              duration: 0.2,
                              ease: "easeOut",
                            },
                          }}
                          className="absolute bottom-0 left-0 right-0 w-full h-full group-hover:text-dark  px-5 pr-8 m-0 z-0 rounded-lg space-x-0"
                          layoutId="highlight"
                        />
                      ) : null}
                    </li>
                  );
                  // }
                })}
              </ul>
            </div>
          </ScrollShadow>

          <div
            className={`w-full overflow-hidden p-4 pt-[calc(100vh-55rem)]  space-y-4 absolute bottom-0`}
          >
            <Divider />
            <ul className="flex flex-col gap-1 mb-2 space-y-2">
              <li className="group">
                <SidebarLink
                  pathname={SidebarRoutes.settings}
                  title="Settings"
                  icon={FiSettings}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={closeSidebar}
                />
              </li>

              <li className="group">
                <Button
                  aria-label="Logout"
                  startContent={<FiLogOut className="text-xl" />}
                  className="group text-base bg-transparent text-kidemia-black2 hover:bg-kidemia-primary hover:text-kidemia-white w-full animate-sidebar-text-show rounded-md py-2 px-4 transition-transform justify-start"
                  onPress={() => logout.onOpen()}
                >
                  Log Out
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <LogoutModal
        isOpen={logout.isOpen}
        onOpenChange={logout.onOpenChange}
        onClose={logout.onClose}
      />
    </>
  );
}
