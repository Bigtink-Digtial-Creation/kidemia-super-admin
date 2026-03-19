import { Navigate, Outlet, useParams } from "react-router";
import { AuthRoutes } from "../routes";
import { usePermissionsChecker } from "../hooks/use-permission";
import { InstitutionProvider } from "../context/InstitutionContext";

type InstitutionRole = "owner" | "admin" | "staff";

interface InstitutionRouteProps {
    allowedRoles?: InstitutionRole[];
    redirectTo?: string;
}

export const InstitutionRoute = ({
    allowedRoles,
    redirectTo = AuthRoutes.unauthorized,
}: InstitutionRouteProps) => {

    const { hasInstitutionAccess, institutionRole, institutionId, isInstitutionOwner } =
        usePermissionsChecker();
    const { institutionId: urlInstitutionId } = useParams();

    // Must have institution membership
    if (!hasInstitutionAccess) return <Navigate to={redirectTo} replace />;

    // Prevent accessing another institution's dashboard via URL tampering
    if (urlInstitutionId && institutionId !== urlInstitutionId) {
        return <Navigate to={redirectTo} replace />;
    }

    // Owner bypasses role checks within institution (mirrors admin on platform)
    if (isInstitutionOwner) return (
        <InstitutionProvider>
            <Outlet />
        </InstitutionProvider>
    );

    // Check role within institution
    if (allowedRoles && !allowedRoles.includes(institutionRole as InstitutionRole)) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <InstitutionProvider>
            <Outlet />
        </InstitutionProvider>
    );
};