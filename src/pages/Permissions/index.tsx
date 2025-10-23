import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "../../utils/queryKeys"
import { ApiSDK } from "../../sdk"

export default function PermissionsPage() {

  const {data:permissions, isLoading} = useQuery({
    queryKey:[QueryKeys.permissions],
    queryFn:() => ApiSDK.PermissionsService.listPermissionsApiV1PermissionsGet()
  })

  console.log({permissions});
  
  return (
    <div>index</div>
  )
}
