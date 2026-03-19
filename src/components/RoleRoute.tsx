import { Navigate, Outlet } from "react-router";
import { AuthRoutes } from "../routes";
import { usePermissionsChecker } from "../hooks/use-permission";

interface RoleRouteProps {
    allowedRoles?: string[];
    requiredPermission?: string;
    redirectTo?: string;
}

export const RoleRoute = ({
    allowedRoles,
    requiredPermission,
    redirectTo = AuthRoutes.unauthorized,
}: RoleRouteProps) => {
    const { hasAnyRole, can, roles } = usePermissionsChecker();

    // No roles assigned at all
    if (!roles.length) return <Navigate to={redirectTo} replace />;

    // Must have one of the allowed roles
    if (allowedRoles && !hasAnyRole(allowedRoles)) {
        return <Navigate to={redirectTo} replace />;
    }

    if (requiredPermission && !can(requiredPermission)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};