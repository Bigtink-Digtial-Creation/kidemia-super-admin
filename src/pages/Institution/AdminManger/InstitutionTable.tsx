import {
    Building2,
    ChevronRight,
    ShieldCheck,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import TierBadge from "./components/TierBadge";
import type {
    InstitutionAdminListItem,
    InstitutionStatusUpdate,
} from "../../../sdk/generated";
import { TIERS } from "../utils";

interface InstitutionTableProps {
    institutions: InstitutionAdminListItem[];
    onSelect: (inst: InstitutionAdminListItem) => void;
    onToggleAccess: ({
        id,
        data,
    }: {
        id: string;
        data: InstitutionStatusUpdate;
    }) => void;
}


function formatDate(iso: string): { absolute: string; relative: string } {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44);
    const diffYears = Math.floor(diffDays / 365.25);

    let relative: string;
    if (diffDays < 1) relative = "Today";
    else if (diffDays === 1) relative = "Yesterday";
    else if (diffDays < 7) relative = `${diffDays}d ago`;
    else if (diffDays < 30) relative = `${diffWeeks}w ago`;
    else if (diffMonths < 12) relative = `${diffMonths}mo ago`;
    else relative = `${diffYears}yr${diffYears > 1 ? "s" : ""} ago`;

    const absolute = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return { absolute, relative };
}


export default function InstitutionTable({
    institutions,
    onSelect,
    onToggleAccess,
}: InstitutionTableProps) {
    if (institutions.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-12 text-center text-gray-400 text-sm">
                No institutions found
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden w-full">
            {/* ── Desktop table ── */}
            <div className="hidden md:block w-full overflow-hidden">
                <table className="w-full text-sm table-fixed border-collapse">
                    <colgroup>
                        <col className="w-[25%]" />
                        <col className="w-[15%]" />
                        <col className="w-[10%]" />
                        <col className="w-[10%]" />
                        <col className="w-[12%]" />
                        <col className="w-[15%]" />
                        <col className="w-[10%]" />
                        <col className="w-[3%]" />
                    </colgroup>

                    <thead className="border-b border-gray-100 bg-gray-50/30">
                        <tr className="text-left">
                            {[
                                "Institution",
                                "Location",
                                "Tier",
                                "Students",
                                "Status",
                                "Owner",
                                "Onboarded",
                                "",
                            ].map((h, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3.5 text-[11px] font-semibold tracking-wide uppercase text-gray-400"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {institutions.map((inst) => {
                            const { absolute, relative } = formatDate(inst.created_at);
                            const loc =
                                [inst.city, inst.state].filter(Boolean).join(", ") || "—";

                            return (
                                <tr
                                    key={inst.id}
                                    onClick={() => onSelect(inst)}
                                    className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                                >
                                    {/* Institution */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: TIERS[inst.tier].bg }}
                                            >
                                                <Building2
                                                    size={14}
                                                    style={{ color: TIERS[inst.tier].color }}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-800 truncate">
                                                    {inst.name}
                                                </p>
                                                <p className="text-[11px] text-gray-400 font-mono tracking-tight">{inst.code}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-2 py-4">
                                        <p className="text-xs text-gray-500 truncate" title={loc}>
                                            {loc}
                                        </p>
                                    </td>

                                    {/* Tier */}
                                    <td className="px-2 py-4">
                                        <TierBadge tier={inst.tier} />
                                    </td>

                                    {/* Students */}
                                    <td className="px-2 py-4">
                                        <span className="font-medium text-gray-700">
                                            {inst.total_students.toLocaleString()}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-2 py-4">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${inst.is_public
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-red-50 text-red-600"
                                                    }`}
                                            >
                                                {inst.is_public ? "Public" : "Private"}
                                            </span>
                                            {inst.is_verified && (
                                                <ShieldCheck size={14} className="text-blue-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </td>

                                    {/* Owner */}
                                    <td className="px-2 py-4">
                                        <p className="text-xs text-gray-400 truncate" title={inst.owner_email!}>
                                            {inst.owner_email}
                                        </p>
                                    </td>

                                    {/* Onboarded */}
                                    <td className="px-2 py-4">
                                        <p className="text-xs text-gray-600 font-normal whitespace-nowrap">
                                            {absolute}
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold mt-0.5">
                                            {relative}
                                        </p>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleAccess({
                                                        id: inst.id,
                                                        data: { is_public: !inst.is_public },
                                                    });
                                                }}
                                                className={`p-1.5 rounded-lg transition-all ${inst.is_public
                                                    ? "text-gray-300 hover:bg-red-50 hover:text-red-500"
                                                    : "text-gray-300 hover:bg-green-50 hover:text-green-600"
                                                    }`}
                                                title={inst.is_public ? "Disable" : "Enable"}
                                            >
                                                {inst.is_public ? (
                                                    <ToggleRight size={20} />
                                                ) : (
                                                    <ToggleLeft size={20} />
                                                )}
                                            </button>
                                            <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile card list ── */}
            <div className="md:hidden divide-y divide-gray-100">
                {institutions.map((inst) => {
                    const { relative } = formatDate(inst.created_at);

                    return (
                        <div
                            key={inst.id}
                            onClick={() => onSelect(inst)}
                            className="p-4 flex items-center gap-3 cursor-pointer hover:bg-orange-50/30 transition-colors"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: TIERS[inst.tier].bg }}
                            >
                                <Building2
                                    size={18}
                                    style={{ color: TIERS[inst.tier].color }}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <p className="font-bold text-gray-900 text-sm truncate">
                                        {inst.name}
                                    </p>
                                    <TierBadge tier={inst.tier} />
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                    {inst.code} • {[inst.city, inst.state].filter(Boolean).join(", ") || "—"}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span
                                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${inst.is_public
                                            ? "bg-green-50 text-green-700"
                                            : "bg-red-50 text-red-600"
                                            }`}
                                    >
                                        {inst.is_public ? "Public" : "Private"}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {inst.total_students.toLocaleString()} students
                                    </span>
                                    <span className="text-[10px] text-gray-400 ml-auto">{relative}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleAccess({
                                            id: inst.id,
                                            data: { is_public: !inst.is_public },
                                        });
                                    }}
                                    className={`p-2 rounded-full ${inst.is_public ? "text-gray-300" : "text-gray-300"}`}
                                >
                                    {inst.is_public ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                </button>
                                <ChevronRight size={16} className="text-gray-300" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}