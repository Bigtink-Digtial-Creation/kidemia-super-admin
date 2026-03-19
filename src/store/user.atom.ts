import { atom } from "jotai";
import { createJSONStorage, atomWithStorage } from "jotai/utils";
import { StoredKeys } from "../utils/storedKeys";
import type { LoginResponse } from "../sdk/generated";

export const encryptedStorage = createJSONStorage<string | null>(
  () => localStorage,
);



export const userRoleAtom = atom<string | null>(null);



export const storedUserData = createJSONStorage<LoginResponse | null>(
  () => localStorage,
);


const persistentStorage = createJSONStorage<any>(() => localStorage);

export const storedAuthTokenAtom = atomWithStorage<string | null>(
  StoredKeys.token,
  null,
  persistentStorage,
  { getOnInit: true }
);

export const loggedinUserAtom = atomWithStorage<LoginResponse | null>(
  StoredKeys.user,
  null,
  persistentStorage,
  { getOnInit: true }
);

export const isAuthenticatedAtom = atom((get) => {
  const token = get(storedAuthTokenAtom);
  const user = get(loggedinUserAtom);
  return !!(token && user);
});

export const currentUserAtom = atom((get) => {
  const userData = get(loggedinUserAtom);
  return userData?.user ?? null;
});

export const hasRoleAtom = (roleName: string) => atom((get) => {
  const user = get(currentUserAtom);
  return user?.roles?.some(role => role.name === roleName) ?? false;
});

export const hasPermissionAtom = (permissionName: string) => atom((get) => {
  const user = get(currentUserAtom);
  if (!user?.roles) return false;
  return user.roles.some(role =>
    role.permissions?.some(permission => permission.name === permissionName)
  ) ?? false;
});

export const userFullNameAtom = atom((get) => {
  const user = get(currentUserAtom);
  if (!user) return '';
  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(' ');
});

export const isUserVerifiedAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user?.is_verified && user?.is_email_verified;
});

export const tokenExpiryAtom = atom((get) => {
  const userData = get(loggedinUserAtom);
  if (!userData) return null;
  return new Date(userData.expires_in);
});

export const clearAuthAtom = atom(null, (_get, set) => {
  set(storedAuthTokenAtom, null);
  set(loggedinUserAtom, null);
  localStorage.removeItem(StoredKeys.token);
  localStorage.removeItem(StoredKeys.user);
  localStorage.removeItem(StoredKeys.institution);
  sessionStorage.clear();
});