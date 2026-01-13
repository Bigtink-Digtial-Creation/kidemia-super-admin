import { atom } from "jotai";
import { createJSONStorage, atomWithStorage } from "jotai/utils";
import { StoredKeys } from "../utils/storedKeys";
import type { LoginResponse } from "../sdk/generated";

export const encryptedStorage = createJSONStorage<string | null>(
  () => localStorage,
);

export const userRoleAtom = atom<string | null>(null);


export const storedAuthTokenAtom = atomWithStorage(
  StoredKeys.token,
  null,
  encryptedStorage,
  {
    getOnInit: true,
  },
);

export const storedUserData = createJSONStorage<LoginResponse | null>(
  () => localStorage,
);

export const loggedinUserAtom = atomWithStorage(
  StoredKeys.user,
  null,
  storedUserData,
  {
    getOnInit: true,
  },
);

/**
 * Derived atom to check if user is authenticated
 * Returns true if both token and user data exist
 */
export const isAuthenticatedAtom = atom(
  (get) => {
    const token = get(storedAuthTokenAtom);
    const user = get(loggedinUserAtom);
    return !!(token && user);
  }
);

/**
 * Atom for clearing auth state (useful for logout)
 * Clears both atoms and removes data from localStorage
 */
export const clearAuthAtom = atom(null, (_get, set) => {
  set(storedAuthTokenAtom, null);
  set(loggedinUserAtom, null);

  // Clear from localStorage using StoredKeys
  localStorage.removeItem(StoredKeys.token);
  localStorage.removeItem(StoredKeys.user);

  // Clear session storage as well
  sessionStorage.clear();
});

/**
 * Derived atom to get current user details
 * Returns null if not authenticated
 */
export const currentUserAtom = atom(
  (get) => {
    const userData = get(loggedinUserAtom);
    return userData?.user ?? null;
  }
);

/**
 * Derived atom to check if user has specific role
 * Usage: const hasRole = useAtomValue(hasRoleAtom('admin'))
 */
export const hasRoleAtom = (roleName: string) => atom(
  (get) => {
    const user = get(currentUserAtom);
    return user?.roles?.some(role => role.name === roleName) ?? false;
  }
);

/**
 * Derived atom to check if user has specific permission
 * Usage: const canEdit = useAtomValue(hasPermissionAtom('edit_content'))
 */
export const hasPermissionAtom = (permissionName: string) => atom(
  (get) => {
    const user = get(currentUserAtom);
    if (!user?.roles) return false;

    return user.roles.some(role =>
      role.permissions?.some(permission => permission.name === permissionName)
    ) ?? false;
  }
);

/**
 * Derived atom to get user's full name
 */
export const userFullNameAtom = atom(
  (get) => {
    const user = get(currentUserAtom);
    if (!user) return '';

    const parts = [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean);

    return parts.join(' ');
  }
);

/**
 * Derived atom to check if user is verified
 */
export const isUserVerifiedAtom = atom(
  (get) => {
    const user = get(currentUserAtom);
    return user?.is_verified && user?.is_email_verified;
  }
);

/**
 * Derived atom to get token expiry time
 */
export const tokenExpiryAtom = atom(
  (get) => {
    const userData = get(loggedinUserAtom);
    if (!userData) return null;

    // Calculate expiry timestamp
    const loginTime = Date.now();
    const expiryTime = loginTime + (userData.expires_in * 1000);

    return new Date(expiryTime);
  }
);