/* eslint-disable @typescript-eslint/no-unused-vars */
import * as API from "./generated";
import { jwtDecode } from "jwt-decode";
import type { ApiRequestOptions } from "./generated/core/ApiRequestOptions";
import { AuthRoutes } from "../routes";
import { StoredKeys } from "../utils/storedKeys";

API.OpenAPI.BASE = import.meta.env.VITE_BASE_URL;

export const ApiSDK = API;

ApiSDK.OpenAPI.TOKEN = async (_: ApiRequestOptions) => {
  return getTokenFromStore(StoredKeys.token);
};

export function getTokenFromStore(key: string) {
  const rawToken = localStorage.getItem(key) ?? "null";
  const parsedToken = JSON.parse(rawToken) ?? null;

  if (parsedToken === null) {
    return parsedToken;
  }

  const decoded = jwtDecode(rawToken);
  const expiredAt = (decoded.exp || 0) * 1000;

  if (expiredAt < Date.now()) {
    localStorage.setItem(key, JSON.stringify(null));
    localStorage.setItem(StoredKeys.user, JSON.stringify(null));
    window.location.replace(AuthRoutes.login);
    return null;
  }
  return parsedToken;
}

export function scheduleTokenExpiry() {
  const rawToken = localStorage.getItem(StoredKeys.token) ?? "null";
  const parsedToken = JSON.parse(rawToken);

  if (!parsedToken) return;

  try {
    const decoded = jwtDecode(rawToken);
    const expiredAt = (decoded.exp || 0) * 1000;
    const msUntilExpiry = expiredAt - Date.now();

    if (msUntilExpiry <= 0) {
      // Already expired
      forceLogout();
      return;
    }

    // Schedule logout exactly when token expires
    setTimeout(() => {
      forceLogout();
    }, msUntilExpiry);

  } catch {
    forceLogout();
  }
}


export function forceLogout() {
  localStorage.setItem(StoredKeys.token, JSON.stringify(null));
  localStorage.setItem(StoredKeys.user, JSON.stringify(null));
  window.location.replace(AuthRoutes.login);
}