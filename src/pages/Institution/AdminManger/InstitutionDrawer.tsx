import { Ban, Building2, Calendar, CheckCircle, GraduationCap, Loader2, Mail, MapPin, ShieldCheck, Users, X } from "lucide-react";
import { TIERS, type TierKey } from "../utils";
import TierBadge from "./components/TierBadge";
import type { InstitutionAdminListItem, InstitutionStatusUpdate } from "../../../sdk/generated";
import { useVerifyInstitution, useChangeInstitutionTier } from "../../../hooks/useInstitutions";
import { addToast } from "@heroui/react";
import { useState } from "react";
import { formatDate } from "../../../utils";

interface InstitutionDrawerProps {
    institution: InstitutionAdminListItem;
    onClose: () => void;
    onToggleAccess: ({ id, data }: { id: string; data: InstitutionStatusUpdate }) => void;
}

export function InstitutionDrawer({ institution: inst, onClose, onToggleAccess }: InstitutionDrawerProps) {
    const tier = TIERS[inst.tier] ?? TIERS.basic;

    const [optimisticTier, setOptimisticTier] = useState<TierKey | string>(inst.tier);

    const verifyInstitution = useVerifyInstitution();
    const changeTier = useChangeInstitutionTier();

    const { absolute } = formatDate(inst.created_at);


    const handleVerify = async () => {
        try {
            await verifyInstitution.mutateAsync({ institutionId: inst.id, data: { is_public: inst.is_public } });
            addToast({
                title: "Success",
                description: "Institution marked as verified",
                variant: "solid",
            });
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error?.message || "Failed to verify institution",
                variant: "solid",
            });
        }
    };

    const handleChangeTier = async (t: TierKey) => {
        if (t === optimisticTier || changeTier.isPending) return;
        const previous = optimisticTier;
        setOptimisticTier(t); // snap immediately
        try {
            await changeTier.mutateAsync({ institutionId: inst.id, tier: t });
            addToast({
                title: "Success",
                description: `Institution tier changed to ${t}`,
                variant: "solid",
            });
        } catch (error: any) {
            setOptimisticTier(previous); // revert on failure
            addToast({
                title: "Error",
                description: error?.message || "Failed to change institution tier",
                variant: "solid",
            });
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex">
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="w-full sm:w-96 bg-white h-full shadow-2xl flex flex-col overflow-hidden max-w-full">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tier.bg }}>
                            <Building2 size={18} style={{ color: tier.color }} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-sm leading-tight truncate">{inst.name}</p>
                            <p className="text-xs text-gray-400">{inst.code}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Status strip */}
                    <div className="flex flex-wrap gap-2">
                        <TierBadge tier={inst.tier} />
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${inst.is_public ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                            {inst.is_public ? <CheckCircle size={10} /> : <Ban size={10} />}
                            {inst.is_public ? "Public" : "Private"}
                        </span>
                        {inst.is_verified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-kidemia-secondary text-white">
                                <ShieldCheck size={10} /> Verified
                            </span>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        {([
                            { label: "Students", value: inst.total_students, icon: Users },
                            { label: "Teachers", value: inst.total_teachers, icon: GraduationCap },
                        ] as const).map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                    <Icon size={16} className="text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-bold text-gray-800">{s.value}</p>
                                        <p className="text-xs text-gray-400">{s.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Details</p>
                        {[
                            { icon: MapPin, text: [inst.city, inst.state, inst.country].filter(Boolean).join(", ") || "—" },
                            { icon: Mail, text: inst.owner_email },
                            { icon: Calendar, text: `Onboarded ${absolute}` },
                        ].map(({ icon: Icon, text }, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-gray-600 min-w-0">
                                <Icon size={14} className="text-gray-400 flex-shrink-0" />
                                <span className="truncate">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Admin Actions</p>

                        {/* Toggle public/private */}
                        <button
                            onClick={() => onToggleAccess({ id: inst.id, data: { is_public: inst.is_public } })}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${inst.is_public ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                        >
                            {inst.is_public ? <Ban size={15} /> : <CheckCircle size={15} />}
                            {inst.is_public ? "Make Private" : "Make Public"}
                        </button>

                        {/* Verify */}
                        <button
                            onClick={handleVerify}
                            disabled={inst.is_verified || verifyInstitution.isPending}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-kidemia-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                        >
                            {verifyInstitution.isPending
                                ? <><Loader2 size={15} className="animate-spin" /> Verifying…</>
                                : <><ShieldCheck size={15} /> {inst.is_verified ? "Already Verified" : "Mark as Verified"}</>
                            }
                        </button>

                        {/* Change tier */}
                        <div className="grid grid-cols-3 gap-2">
                            {(["basic", "premium", "enterprise"] as TierKey[]).map(t => {
                                const isActive = optimisticTier === t;
                                const isInFlight = changeTier.isPending && changeTier.variables?.tier === t;

                                return (
                                    <button
                                        key={t}
                                        onClick={() => handleChangeTier(t)}
                                        disabled={isInFlight}
                                        className="py-2 rounded-lg text-xs font-semibold capitalize transition-all relative"
                                        style={isActive
                                            ? { backgroundColor: TIERS[t].color, color: "#fff" }
                                            : { backgroundColor: "#f3f4f6", color: "#6b7280" }
                                        }
                                    >
                                        {isInFlight
                                            ? <Loader2 size={12} className="animate-spin mx-auto" />
                                            : t
                                        }
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-400 text-center">Change tier</p>
                    </div>
                </div>
            </div>
        </div>
    );
}