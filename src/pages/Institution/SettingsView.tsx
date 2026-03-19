import { useState, useEffect } from "react";
import { addToast } from "@heroui/react";
import { Save, Building2, Globe, Palette } from "lucide-react";
import { Btn } from "./components/index";
import {
    useInstitutionProfile,
    useUpdateInstitutionProfile,
} from "../../hooks/useSchools";
import { usePermissionsChecker } from "../../hooks/use-permission";


function Toggle({
    value,
    onChange,
    label,
    description,
}: {
    value: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-gray-700">{label}</p>
                {description && (
                    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                )}
            </div>
            <div
                onClick={() => onChange(!value)}
                className="w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors flex-shrink-0 mt-0.5"
                style={{ backgroundColor: value ? "#e07b39" : "#e5e7eb" }}
            >
                <span
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${value ? "translate-x-5" : ""
                        }`}
                />
            </div>
        </div>
    );
}

function SectionTitle({
    icon: Icon,
    title,
}: {
    icon: typeof Building2;
    title: string;
}) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <Icon size={14} className="text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
        </div>
    );
}

function Field({
    label,
    children,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                {label}
            </label>
            {children}
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
}

const inputCls = (disabled: boolean) =>
    `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white text-gray-800"
    }`;


interface FormState {
    name: string;
    description: string;
    motto: string;
    academic_session: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    state: string;
    country: string;
    logo_url: string;
    banner_url: string;
    color_primary: string;
    color_secondary: string;
}

const DEFAULT_FORM: FormState = {
    name: "",
    description: "",
    motto: "",
    academic_session: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    logo_url: "",
    banner_url: "",
    color_primary: "#e07b39",
    color_secondary: "#6366f1",
};

export function SettingsView() {
    const { data: profile, isLoading } = useInstitutionProfile();
    const updateProfile = useUpdateInstitutionProfile();
    const { isInstitutionOwner, institutionRole } = usePermissionsChecker();

    const canEdit = isInstitutionOwner || institutionRole === "admin";

    const [form, setForm] = useState<FormState>(DEFAULT_FORM);
    const [isPublic, setIsPublic] = useState(true);

    // Notification preferences (local state — wire to backend when ready)
    // const [notifs, setNotifs] = useState(true);
    // const [emails, setEmails] = useState(false);
    // const [smsAlerts, setSmsAlerts] = useState(false);

    useEffect(() => {
        if (profile) {
            setForm({
                name: profile.name ?? "",
                description: profile.description ?? "",
                motto: profile.motto ?? "",
                academic_session: profile.academic_session ?? "",
                email: profile.email ?? "",
                phone: profile.phone ?? "",
                website: profile.website ?? "",
                address: profile.address ?? "",
                city: profile.city ?? "",
                state: profile.state ?? "",
                country: profile.country ?? "",
                logo_url: profile.logo_url ?? "",
                banner_url: profile.banner_url ?? "",
                color_primary: profile.color_primary ?? "#e07b39",
                color_secondary: profile.color_secondary ?? "#6366f1",
            });
            setIsPublic(profile.is_public ?? true);
        }
    }, [profile]);

    const update = (key: keyof FormState, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSave = () => {
        updateProfile.mutate(
            { ...form, is_public: isPublic },
            {
                onSuccess: () =>
                    addToast({ title: "Settings saved successfully", color: "success" }),
                onError: (err: any) =>
                    addToast({
                        title: "Failed to save settings",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    }),
            }
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-4 max-w-2xl animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl border border-gray-100 h-48"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-2xl">
            {/* Page header */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Settings</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                    Manage institution preferences and profile
                </p>
            </div>

            {/* Read-only warning for non-owners */}
            {!canEdit && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                    You have read-only access. Contact the institution owner to make
                    changes.
                </div>
            )}

            {/* ── Institution identity ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4">
                <SectionTitle icon={Building2} title="Institution Info" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Institution name">
                        <input
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            disabled={!canEdit}
                            className={inputCls(!canEdit)}
                        />
                    </Field>
                    <Field label="Academic session">
                        <input
                            value={form.academic_session}
                            onChange={(e) => update("academic_session", e.target.value)}
                            placeholder="e.g. 2024/2025"
                            disabled={!canEdit}
                            className={inputCls(!canEdit)}
                        />
                    </Field>
                </div>

                <Field label="Motto">
                    <input
                        value={form.motto}
                        onChange={(e) => update("motto", e.target.value)}
                        placeholder="e.g. Excellence in Education"
                        disabled={!canEdit}
                        className={inputCls(!canEdit)}
                    />
                </Field>

                <Field label="Description">
                    <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        rows={3}
                        disabled={!canEdit}
                        placeholder="Brief description of your institution"
                        className={`${inputCls(!canEdit)} resize-none`}
                    />
                </Field>

                {/* Institution code — always read-only */}
                <Field
                    label="Institution code"
                    hint="Share this code with students to link them to your institution."
                >
                    <div className="flex items-center gap-2">
                        <input
                            value={profile?.code ?? ""}
                            readOnly
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 font-mono"
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(profile?.code ?? "");
                                addToast({ title: "Code copied", color: "success" });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            Copy
                        </button>
                    </div>
                </Field>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4">
                <SectionTitle icon={Globe} title="Contact & Location" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Admin email">
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            disabled={!canEdit}
                            className={inputCls(!canEdit)}
                        />
                    </Field>
                    <Field label="Phone number">
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="+234 800 000 0000"
                            disabled={!canEdit}
                            className={inputCls(!canEdit)}
                        />
                    </Field>
                </div>

                <Field label="Website">
                    <input
                        type="url"
                        value={form.website}
                        onChange={(e) => update("website", e.target.value)}
                        placeholder="https://yourschool.edu.ng"
                        disabled={!canEdit}
                        className={inputCls(!canEdit)}
                    />
                </Field>

                <Field label="Address">
                    <input
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                        placeholder="14 School Road"
                        disabled={!canEdit}
                        className={inputCls(!canEdit)}
                    />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="City">
                        <input
                            value={form.city}
                            onChange={(e) => update("city", e.target.value)}
                            disabled={!canEdit}
                            className={inputCls(!canEdit)}
                        />
                    </Field>
                    <Field label="State">
                        <input
                            value={form.state}
                            onChange={(e) => update("state", e.target.value)}
                            disabled={!canEdit}
                            className={inputCls(!canEdit)}
                        />
                    </Field>
                    <Field label="Country">
                        <input
                            value={form.country}
                            onChange={(e) => update("country", e.target.value)}
                            disabled={!canEdit}
                            className={inputCls(!canEdit)}
                        />
                    </Field>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4">
                <SectionTitle icon={Palette} title="Branding" />

                <Field
                    label="Logo URL"
                    hint="Direct link to your institution logo (PNG or SVG recommended)"
                >
                    <div className="flex items-center gap-3">
                        {form.logo_url && (
                            <img
                                src={form.logo_url}
                                alt="Logo preview"
                                className="w-10 h-10 rounded-lg object-contain border border-gray-200 flex-shrink-0"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                        )}
                        <input
                            type="url"
                            value={form.logo_url}
                            onChange={(e) => update("logo_url", e.target.value)}
                            placeholder="https://yourschool.edu.ng/logo.png"
                            disabled={!canEdit}
                            className={inputCls(!canEdit)}
                        />
                    </div>
                </Field>

                <Field
                    label="Banner URL"
                    hint="Wide banner image for the institution profile page"
                >
                    <input
                        type="url"
                        value={form.banner_url}
                        onChange={(e) => update("banner_url", e.target.value)}
                        placeholder="https://yourschool.edu.ng/banner.jpg"
                        disabled={!canEdit}
                        className={inputCls(!canEdit)}
                    />
                </Field>

                <div className=" grid grid-cols-2 gap-3">
                    <Field label="Primary colour">
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={form.color_primary}
                                onChange={(e) => update("color_primary", e.target.value)}
                                disabled={!canEdit}
                                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer disabled:cursor-not-allowed p-0.5"
                            />
                            <input
                                value={form.color_primary}
                                onChange={(e) => update("color_primary", e.target.value)}
                                placeholder="#e07b39"
                                disabled={!canEdit}
                                className={`${inputCls(!canEdit)} font-mono`}
                            />
                        </div>
                    </Field>
                    <Field label="Secondary colour">
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={form.color_secondary}
                                onChange={(e) => update("color_secondary", e.target.value)}
                                disabled={!canEdit}
                                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer disabled:cursor-not-allowed p-0.5"
                            />
                            <input
                                value={form.color_secondary}
                                onChange={(e) => update("color_secondary", e.target.value)}
                                placeholder="#6366f1"
                                disabled={!canEdit}
                                className={`${inputCls(!canEdit)} font-mono`}
                            />
                        </div>
                    </Field>
                </div>

                {/* Live colour preview */}
                {canEdit && (
                    <div
                        className="rounded-xl p-4 flex items-center gap-3"
                        style={{ backgroundColor: form.color_primary + "18" }}
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: form.color_primary }}
                        />
                        <div
                            className="w-8 h-8 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: form.color_secondary }}
                        />
                        <p className="text-xs text-gray-500">Colour preview</p>
                    </div>
                )}
            </div>

            <div className="hidden bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4">
                <SectionTitle icon={Globe} title="Visibility" />
                <Toggle
                    value={isPublic}
                    onChange={setIsPublic}
                    label="Public institution profile"
                    description="Allow students to discover and join your institution"
                />
            </div>



            {canEdit && (
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-gray-400">
                        Last updated:{" "}
                        {profile?.created_at
                            ? new Date(profile.created_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })
                            : "—"}
                    </p>
                    <Btn
                        icon={<Save size={14} />}
                        onClick={handleSave}
                        disabled={updateProfile.isPending}
                    >
                        Save Changes
                    </Btn>
                </div>
            )}
        </div>
    );
}