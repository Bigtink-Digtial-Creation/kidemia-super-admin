import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuthRedirect } from "../hooks/use-auth-redirect";
import BallSpinner from "../components/Spinner/BallSpinner";
import { institutionAccessAtom } from "../store/institution.atom";
import { useAtomValue } from "jotai";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { loggedInUser, authToken } = useAuthRedirect(true);
  const institutionAccess = useAtomValue(institutionAccessAtom);

  if (!loggedInUser || !authToken) {
    return (
      <div className="h-screen flex justify-center items-center">
        <BallSpinner />
      </div>
    );
  }

  if (institutionAccess) {
    return (
      <Navigate
        to={`/institution/${institutionAccess.institutionId}/dashboard`}
        replace
      />
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
              <div className="mx-auto max-w-screen-2xl  px-3 py-4">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
