import React from "react";
import { Avatar, Image } from "@heroui/react";
import { Link } from "react-router";
import { IoMenu } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { SidebarRoutes } from "../../routes";
import AppLogo from "@/assets/appLogo.png";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import { getNameIntials } from "../../utils";
import { QueryKeys } from "../../utils/queryKeys";

type HeaderT = {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (argO: boolean) => void;
};

export default function Header(props: HeaderT) {
  const handleOpenSidebar = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    props.setSidebarOpen(!props.sidebarOpen);
  };

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [QueryKeys.user],
    queryFn: () => ApiSDK.AuthenticationService.getCurrentUserApiV1AuthMeGet(),
  });

  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className="sticky top-0 z-20 flex w-full bg-kidemia-white drop-shadow-1">
        {isUserLoading ? null : (
          <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
            <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
              <button
                aria-controls="sidebar"
                onClick={handleOpenSidebar}
                className="z-20 block rounded-sm border border-stroke p-1.5 shadow-sm lg:hidden"
              >
                <IoMenu />
              </button>
              <Link
                to={SidebarRoutes.dashboard}
                className="flex-shrink-0 hidden"
              >
                <Image src={AppLogo} alt="Logo" width={100} />
              </Link>
            </div>
            <div className="sm:block w-2/5 flex-1 ml-4">
              <h3 className="text-kidemia-black2 text-base font-semibold capitalize">
                Hey, {user?.first_name}
              </h3>
            </div>

            <div>
              <div className="flex items-center space-x-6">
                <FaBell className="text-xl cursor-pointer" />
                <Link to={SidebarRoutes.profile}>
                  <Avatar
                    size="sm"
                    isBordered
                    className="cursor-pointer uppercase font-extrabold text-kidemia-primary"
                    src={user?.profile_picture_url as string}
                    showFallback
                    name={getNameIntials(fullName) as string}
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
