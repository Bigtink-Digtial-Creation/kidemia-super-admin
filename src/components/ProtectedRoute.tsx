import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAtomValue } from "jotai";
import { storedAuthTokenAtom, loggedinUserAtom } from "../store/user.atom";
import { AuthRoutes } from "../routes";
import { ApiSDK } from "../sdk";

export const ProtectedRoute = () => {
    const token = useAtomValue(storedAuthTokenAtom);
    const user = useAtomValue(loggedinUserAtom);
    const location = useLocation();

    useEffect(() => {
        if (token) {
            ApiSDK.OpenAPI.TOKEN = token;
        }
    }, [token]);

    if (!token || !user) {
        return <Navigate to={AuthRoutes.login} state={{ from: location }} replace />;
    }

    return <Outlet />;
};