import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Image,
  ScrollShadow,
  useDisclosure,
} from "@heroui/react";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiSettings } from "react-icons/fi";

import LogoutModal from "./LogoutModal";
import AppLogo from "@/assets/appLogo.png";
import SidebarLink from "./SidebarLink.tsx";
import { sidebarLinks } from "./sidebarLink.ts";
import { SidebarRoutes } from "../../routes/index.ts";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [focused, setFocused] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const logout = useDisclosure();

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  useEffect(() => {
    const clickOutsideHandler = (e: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        window.innerWidth < 1024
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, [sidebarOpen, closeSidebar]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-kidemia-white">
      {/* Logo */}
      <div className="w-full flex items-center justify-between px-6 py-4">
        <NavLink to="/dashboard">
          <Image src={AppLogo} alt="Logo" width={80} />
        </NavLink>
      </div>

      {/* Links */}
      <div className="flex-1">
        <ScrollShadow hideScrollBar as="nav" className="p-4">
          <ul className="flex flex-col space-y-3">
            {sidebarLinks.map((link) => (
              <li
                key={link.pathname}
                className="relative"
                onMouseEnter={() => setFocused(link.title)}
                onMouseLeave={() => setFocused(null)}
              >
                <SidebarLink
                  {...link}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />

                {focused === link.title && (
                  <motion.div
                    layoutId="highlight"
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-0 rounded-lg bg-kidemia-primary/10 pointer-events-none"
                  />
                )}
              </li>
            ))}
          </ul>
        </ScrollShadow>

        {/* Bottom actions */}
        <div className="p-4 mt-auto space-y-4">
          <Divider />

          <SidebarLink
            title="Platform settings"
            pathname={SidebarRoutes.settings}
            icon={FiSettings}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <Button
            startContent={<FiLogOut className="text-xl" />}
            className="w-full justify-start bg-transparent text-kidemia-black2 hover:bg-kidemia-primary hover:text-white"
            onPress={logout.onOpen}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={closeSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <aside
        ref={sidebarRef}
        className={`fixed lg:static left-0 top-0 z-50 h-screen w-64 
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {sidebarContent}
      </aside>

      <LogoutModal
        isOpen={logout.isOpen}
        onOpenChange={logout.onOpenChange}
        onClose={logout.onClose}
      />
    </>
  );
}