import { useEffect } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { AuthRoutes, SidebarRoutes } from "../routes";
import { loggedinUserAtom, storedAuthTokenAtom } from "../store/user.atom";

export function useAuthRedirect(requireAuth = true) {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useAtom(loggedinUserAtom);
  const [authToken, setAuthToken] = useAtom(storedAuthTokenAtom);

  useEffect(() => {
    if (!authToken) {
      if (requireAuth) {
        navigate(AuthRoutes.login, { replace: true });
      }
      return;
    }
    try {
      const decoded: { exp: number; iat: number } = jwtDecode(authToken);
      const expireAt = decoded.exp * 1000;

      if (expireAt < Date.now()) {
        setAuthToken(null);
        setLoggedInUser(null);
        navigate(AuthRoutes.login, { replace: true });
        return;
      }
    } catch (err) {
      console.error(err);
      navigate(AuthRoutes.login, { replace: true });
      return;
    }

    if (requireAuth && !loggedInUser) {
      navigate(AuthRoutes.login, { replace: true });
    } else if (!requireAuth && loggedInUser) {
      navigate(SidebarRoutes.dashboard, { replace: true });
    }
  }, [
    loggedInUser,
    authToken,
    navigate,
    requireAuth,
    setLoggedInUser,
    setAuthToken,
  ]);
  return { loggedInUser, authToken };
}
