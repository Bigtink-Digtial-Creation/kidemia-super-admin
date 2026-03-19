import { useState } from "react";
import { Building2, Plus, Upload } from "lucide-react";
import OnboardModal from "./components/OnboardModal";
import BulkOnboardModal from "./components/BulkOnboardModal";
import { InstitutionDrawer } from "./InstitutionDrawer";
import StatsBar from "./components/StatsBar";
import FilterBar from "./components/FilterBar";
import InstitutionTable from "./InstitutionTable";
import { useInstitutions, useToggleInstitutionAccess } from "../../../hooks/useInstitutions";
import type { InstitutionAdminListItem, InstitutionOnboardRequest, InstitutionStatusUpdate } from "../../../sdk/generated";
import { addToast } from "@heroui/react";

type ModalType = "single" | "bulk" | null;

export default function AdminInstitutionManager() {
    const [modal, setModal] = useState<ModalType>(null);
    const [selected, setSelected] = useState<InstitutionAdminListItem | null>(null);

    const { institutions, isLoading, filters, setFilters } = useInstitutions();
    const toggleAccess = useToggleInstitutionAccess();

    // AdminInstitutionManager.tsx

    const handleOnboardSuccess = (inst: InstitutionOnboardRequest) => {
        setModal(null);
        addToast({
            title: "Institution Onboarded",
            description: `${inst.name} has been onboarded successfully`,
        });
    };

    const handleToggleAccess = async ({ id, data }: { id: string, data: InstitutionStatusUpdate }) => {
        try {
            await toggleAccess.mutateAsync({ institutionId: id, data: { is_public: !data.is_public } });
            setSelected(prev => prev?.id === id ? { ...prev, is_public: !prev.is_public } : prev);
            addToast({
                title: "Institution Access Updated",
                description: `Institution has been ${data.is_public ? "disabled" : "re-enabled"}`,
            });
        } catch {
            addToast({
                title: "Error",
                description: "Failed to update institution access",
                variant: "solid",
            });
        }
    };

    // Client-side filter only for search/tier/active (or remove if API handles it)
    const filtered = institutions.filter(inst => {
        const matchSearch =
            !filters.search ||
            inst.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            inst.code.toLowerCase().includes(filters.search.toLowerCase());

        const matchTier = !filters.tier || inst.tier === filters.tier;

        const matchPublic =
            filters.is_public === '' ? true : inst.is_public === filters.is_public;

        return matchSearch && matchTier && matchPublic;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-kidemia-secondary">
                            <Building2 size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="font-bold text-gray-800 text-sm sm:text-base">Institution Management</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Onboard and manage all institutions on the platform</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <button
                            onClick={() => setModal("bulk")}
                            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-gray-200 text-sm text-primary font-medium hover:bg-gray-50 transition-colors"
                        >
                            <Upload size={14} className="text-kidemia-secondary" />
                            <span className="hidden sm:inline text-kidemia-secondary">Bulk Upload</span>
                        </button>
                        <button
                            onClick={() => setModal("single")}
                            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors bg-kidemia-secondary"
                        >
                            <Plus size={14} />
                            <span className="hidden sm:inline">Onboard Institution</span>
                            <span className="sm:hidden">Onboard</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-4 sm:space-y-5">
                <StatsBar institutions={institutions} />
                <FilterBar
                    search={filters.search}
                    onSearch={search => setFilters(f => ({ ...f, search }))}
                    filterTier={filters.tier}
                    onFilterTier={tier => setFilters(f => ({ ...f, tier }))}
                    filterActive={filters.is_public}
                    onFilterActive={is_public => setFilters(f => ({ ...f, is_public: is_public }))}
                    count={filtered.length}
                />
                {isLoading ? (
                    <div className="text-center py-12 text-gray-400">Loading institutions...</div>
                ) : (
                    <InstitutionTable
                        institutions={filtered}
                        onSelect={setSelected}
                        onToggleAccess={handleToggleAccess}
                    />
                )}
            </div>

            {modal === "single" &&
                <OnboardModal onClose={() => setModal(null)}
                    onSuccess={handleOnboardSuccess} />}
            {modal === "bulk" && <BulkOnboardModal onClose={() => setModal(null)} />}
            {selected && (
                <InstitutionDrawer
                    institution={selected}
                    onClose={() => setSelected(null)}
                    onToggleAccess={handleToggleAccess}
                />
            )}
        </div>
    );
}