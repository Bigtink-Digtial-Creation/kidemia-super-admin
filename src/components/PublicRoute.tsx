import { Navigate, Outlet, useLocation } from "react-router";
import { useAtomValue } from "jotai";
import { storedAuthTokenAtom, loggedinUserAtom } from "../store/user.atom";
import { SidebarRoutes } from "../routes";


export const PublicRoute = () => {
    const token = useAtomValue(storedAuthTokenAtom);
    const user = useAtomValue(loggedinUserAtom);
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || SidebarRoutes.dashboard;

    if (token && user) {
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
};