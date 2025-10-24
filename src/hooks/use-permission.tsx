import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../utils/queryKeys";
import { ApiSDK } from "../sdk";

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
