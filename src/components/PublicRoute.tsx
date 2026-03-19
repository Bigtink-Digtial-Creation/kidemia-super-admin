import { Navigate, Outlet } from "react-router";
import { useAtomValue } from "jotai";
import { storedAuthTokenAtom, loggedinUserAtom } from "../store/user.atom";
import { institutionAccessAtom } from "../store/institution.atom";
import { SidebarRoutes } from "../routes";

export const PublicRoute = () => {
    const token = useAtomValue(storedAuthTokenAtom);
    const loginData = useAtomValue(loggedinUserAtom);
    const institutionAccess = useAtomValue(institutionAccessAtom);

    if (token && loginData) {
        if (institutionAccess?.institutionId) {
            return <Navigate
                to={`/institution/${institutionAccess.institutionId}/dashboard`}
                replace
            />;
        }
        return <Navigate to={SidebarRoutes.dashboard} replace />;
    }

    return <Outlet />;
};