import { createJSONStorage, atomWithStorage } from "jotai/utils";
import { StoredKeys } from "../utils/storedKeys";
import type { LoginResponse } from "../sdk/generated";

export const encryptedStorage = createJSONStorage<string | null>(
  () => localStorage
);

export const storedAuthTokenAtom = atomWithStorage(
  StoredKeys.token,
  null,
  encryptedStorage,
  {
    getOnInit: true,
  }
);

export const storedUserData = createJSONStorage<LoginResponse | null>(
  () => localStorage
);

export const loggedinUserAtom = atomWithStorage(
  StoredKeys.user,
  null,
  storedUserData,
  {
    getOnInit: true,
  }
);
