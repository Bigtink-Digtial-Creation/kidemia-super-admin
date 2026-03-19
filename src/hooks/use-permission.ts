import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../utils/queryKeys";

import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../store/user.atom";
import { institutionAccessAtom } from "../store/institution.atom"
import { ApiSDK } from "../sdk";
import { useMemo } from "react";



export function usePermissions() {
  const query = useQuery({
    queryKey: [QueryKeys.permissions],
    queryFn: () =>
      ApiSDK.PermissionsService.listPermissionsApiV1PermissionsGet(),
  });

  return {
    permissions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
;


export const usePermissionsChecker = () => {
  const loginData = useAtomValue(loggedinUserAtom);
  const institutionAccess = useAtomValue(institutionAccessAtom);

  const user = loginData?.user;

  const roles = useMemo(
    () => user?.roles?.map((r) => r.name) ?? [],
    [user]
  );

  const permissionSet = useMemo(() => {
    const perms =
      user?.roles?.flatMap((role) =>
        role.permissions?.map((p) => p.name) ?? []
      ) ?? [];

    return new Set(perms);
  }, [user]);

  const isAdministrator = roles.includes("super_admin");

  const can = (permission: string) => {
    if (isAdministrator) return true;
    return permissionSet.has(permission);
  };

  return {
    // role helpers
    roles,
    isAdministrator,
    hasRole: (role: string) => roles.includes(role),
    hasAnyRole: (checkRoles: string[]) =>
      checkRoles.some((r) => roles.includes(r)),

    // permission helper
    can,

    // institution helpers
    hasInstitutionAccess: !!institutionAccess,
    institutionRole: institutionAccess?.role ?? null,
    institutionId: institutionAccess?.institutionId ?? null,
    isInstitutionOwner: institutionAccess?.role === "owner",

    // raw permissions set
    permissionSet,
  };
};