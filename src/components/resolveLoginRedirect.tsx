import type { LoginResponse } from "../sdk/generated";
import { SidebarRoutes } from "../routes";

export function resolveLoginRedirect(
    data: LoginResponse,
    intendedPath?: string
): string {
    if (intendedPath && intendedPath !== "/") return intendedPath;

    if (data.institution_id) {
        return `/institution/${data.institution_id}/dashboard`;
    }

    return SidebarRoutes.dashboard;
}