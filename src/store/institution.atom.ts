import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { StoredKeys } from "../utils/storedKeys";

interface InstitutionAccess {
    institutionId: string;
    role: string;
}

// Always localStorage — consistent with user atom
const persistentStorage = createJSONStorage<InstitutionAccess | null>(
    () => localStorage
);

export const institutionAccessAtom = atomWithStorage<InstitutionAccess | null>(
    StoredKeys.institution,
    null,
    persistentStorage,
    { getOnInit: true }
);