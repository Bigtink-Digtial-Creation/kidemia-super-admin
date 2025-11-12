import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Divider, Image, ScrollShadow, useDisclosure } from "@heroui/react";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiSettings } from "react-icons/fi";
import SidebarLink from "./SidebarLink.tsx";
import { sidebarLinks } from "./sidebarLink.ts";
import LogoutModal from "./LogoutModal";
import AppLogo from "@/assets/appLogo.png";

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

  const closeSidebar = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);

  useEffect(() => {
    const clickOutsideHandler = (e: MouseEvent) => {
      if (
        sidebarOpen &&
        !sidebarRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node) &&
        !backdropRef.current?.contains(e.target as Node)
      ) {
        closeSidebar();
      }
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (sidebarOpen && e.key === "Escape") closeSidebar();
    };

    document.addEventListener("click", clickOutsideHandler);
    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("click", clickOutsideHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [sidebarOpen, closeSidebar]);

  // Sidebar content (links + bottom actions)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="w-full flex items-center justify-between px-6 py-4">
        <NavLink to="/dashboard" className="animate-sidebar-text-show">
          <Image src={AppLogo} alt="Logo" width={80} />
        </NavLink>
      </div>

      {/* Links */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <ScrollShadow hideScrollBar={true} as="nav" className="p-4">
          <ul className="flex flex-col space-y-3">
            {sidebarLinks.map((link) => (
              <li
                key={link.pathname}
                className="group relative"
                onMouseEnter={() => setFocused(link.title)}
                onMouseLeave={() => setFocused("")}
              >
                <SidebarLink
                  pathname={link.pathname}
                  title={link.title}
                  icon={link.icon}
                  sidebarOpen={true} // Always open on desktop
                  setSidebarOpen={closeSidebar}
                />
                {focused === link.title && (
                  <motion.div
                    layoutId="highlight"
                    transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                    className="absolute bottom-0 left-0 right-0 w-full h-full px-5 pr-8 m-0 z-0 rounded-lg bg-kidemia-primary/10"
                  />
                )}
              </li>
            ))}
          </ul>
        </ScrollShadow>

        {/* Bottom Actions */}
        <div className="w-full p-4 space-y-4 mt-auto">
          <Divider />
          <ul className="flex flex-col gap-1">
            <li className="group">
              <SidebarLink
                pathname="/settings"
                title="Settings"
                icon={FiSettings}
                sidebarOpen={true}
                setSidebarOpen={closeSidebar}
              />
            </li>
            <li className="group">
              <Button
                aria-label="Logout"
                startContent={<FiLogOut className="text-xl" />}
                className="group text-base bg-transparent text-kidemia-black2 hover:bg-kidemia-primary hover:text-kidemia-white w-full rounded-md py-2 px-4 justify-start"
                onPress={logout.onOpen}
              >
                Log Out
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            ref={backdropRef}
            className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`w-2xs absolute left-0 top-0 z-50 h-screen flex-col overflow-y-clip shadow-md dark:bg-dark lg:static lg:translate-x-0 ${sidebarOpen
          ? "translate-x-0 bg-[#f5f6fa]/100"
          : "-translate-x-full bg-[#f5f6fa]/100"
          }`}
      >
        {/* Mobile AnimatePresence */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden w-full h-full"
            >
              {sidebarContent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop sidebar always visible */}
        <div className="hidden lg:flex w-full h-full">{sidebarContent}</div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logout.isOpen}
        onOpenChange={logout.onOpenChange}
        onClose={logout.onClose}
      />
    </>
  );
}
