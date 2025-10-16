import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuthRedirect } from "../hooks/use-auth-redirect";
import { Spinner } from "@heroui/react";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { loggedInUser, authToken } = useAuthRedirect(true);

  if (!loggedInUser || !authToken) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            sidebarOpen={isSidebarOpen}
            setSidebarOpen={setIsSidebarOpen}
          />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header
              sidebarOpen={isSidebarOpen}
              setSidebarOpen={setIsSidebarOpen}
            />
            <main>
              <div className="mx-auto max-w-screen-2xl px-3 py-4">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
