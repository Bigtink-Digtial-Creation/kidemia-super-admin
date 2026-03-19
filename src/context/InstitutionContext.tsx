import { createContext, useContext, type ReactNode } from "react";
import { useAtomValue } from "jotai";
import { institutionAccessAtom } from "../store/institution.atom";

interface InstitutionContextValue {
    institutionId: string;
    role: string;
}

const InstitutionContext = createContext<InstitutionContextValue | null>(null);

export function InstitutionProvider({ children }: { children: ReactNode }) {
    const institutionAccess = useAtomValue(institutionAccessAtom);

    // InstitutionRoute guard already ensures this exists before we render
    // but we guard again here for type safety
    if (!institutionAccess) return null;

    return (
        <InstitutionContext.Provider
            value={{
                institutionId: institutionAccess.institutionId,
                role: institutionAccess.role,
            }}
        >
            {children}
        </InstitutionContext.Provider>
    );
}

export const useInstitution = () => {
    const ctx = useContext(InstitutionContext);
    if (!ctx) throw new Error("useInstitution must be used within InstitutionProvider");
    return ctx;
};