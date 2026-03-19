import { useRef, useState } from "react";
import type { TierKey } from "../../utils";
import { Building2, CheckCircle, GraduationCap, Loader2, X } from "lucide-react";
import { useCreateInstitution } from "../../../../hooks/useInstitutions";
import type { InstitutionOnboardRequest } from "../../../../sdk/generated";
import { addToast } from "@heroui/react";


interface OnboardModalProps {
    onClose: () => void;
    onSuccess: (inst: InstitutionOnboardRequest) => void;

}

interface OnboardForm {
    name: string;
    code: string;
    description: string;
    email: string;
    phone: string;
    website: string;
    city: string;
    state: string;
    country: string;
    owner_email: string;
    owner_first_name: string;
    owner_last_name: string;
    owner_phone: string;
    tier: TierKey;
    max_students: string;
    is_verified: boolean;
    is_public: boolean;
    send_welcome_email: boolean;
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-kidemia-primary focus:outline-none focus:ring-2 focus:ring-[#e07b39]/30 focus:border-[#e07b39] transition-colors bg-white";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function OnboardModal({ onClose, onSuccess }: OnboardModalProps) {
    const [step, setStep] = useState<1 | 2>(1);

    const [form, setForm] = useState<OnboardForm>({
        name: "", code: "", description: "", email: "", phone: "", website: "",
        city: "", state: "", country: "Nigeria",
        owner_email: "", owner_first_name: "", owner_last_name: "", owner_phone: "",
        tier: "basic", max_students: "", is_verified: false, is_public: true,
        send_welcome_email: true,
    });

    const set = <K extends keyof OnboardForm>(key: K, val: OnboardForm[K]) =>
        setForm(f => ({ ...f, [key]: val }));

    const autoCode = () => {
        if (!form.code && form.name) {
            const words = form.name.split(" ").filter(Boolean);
            const acr = words.map(w => w[0]).join("").toUpperCase().slice(0, 4);
            set("code", `${acr}-${Math.floor(100 + Math.random() * 900)}`);
        }
    };

    const createInstitution = useCreateInstitution();

    const submittingRef = useRef(false);

    const handleSubmit = async () => {
        if (submittingRef.current || createInstitution.isPending) return;
        submittingRef.current = true;

        try {
            await createInstitution.mutateAsync({
                ...form,
                max_students: form.max_students ? parseInt(form.max_students) : 0,
            });
            onSuccess({ ...form, max_students: form.max_students ? parseInt(form.max_students) : 0 });
        } catch (err: any) {
            addToast({
                title: "Error",
                description: err?.message || err?.body?.message || err?.body?.detail || "Failed to onboard institution",
                variant: "solid",
            });
            //  
        } finally {
            submittingRef.current = false;
        }
    };



    const toggleKeys: (keyof OnboardForm)[] = ["is_verified", "is_public"];
    const toggleLabels: Record<string, string> = {
        is_verified: "Mark as verified",
        is_public: "Activate immediately",
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white">
                            <Building2 size={18} className="text-kidemia-secondary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-sm sm:text-base">Onboard Institution</h2>
                            <p className="text-xs text-gray-400">Step {step} of 2 — {step === 1 ? "Institution details" : "Owner & settings"}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Step pills */}
                <div className="flex gap-2 px-4 sm:px-6 pt-4 flex-shrink-0">
                    {([1, 2] as const).map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? "text-white" : "bg-gray-100 text-gray-400"}`}
                                style={step >= s ? { backgroundColor: 'kidemia-secondary' } : {}}>
                                {step > s ? <CheckCircle size={14} /> : s}
                            </div>
                            <span className={`text-xs font-medium hidden sm:block ${step >= s ? "text-kidemia-primary" : "text-gray-400"}`}>
                                {s === 1 ? "Institution" : "Owner & Access"}
                            </span>
                            {s < 2 && <div className="w-6 sm:w-8 h-px bg-gray-200 mx-1" />}
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-1 sm:col-span-2">
                                    <label className={labelCls}>Institution Name *</label>
                                    <input className={inputCls} placeholder="e.g. Greenfield Academy" value={form.name} onChange={e => set("name", e.target.value)} onBlur={autoCode} />
                                </div>
                                <div>
                                    <label className={labelCls}>Unique Code *</label>
                                    <input className={inputCls} placeholder="e.g. GFA-LG" value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} />
                                    <p className="text-xs text-gray-400 mt-1">Auto-generated from name. You can edit.</p>
                                </div>
                                <div>
                                    <label className={labelCls}>Email</label>
                                    <input className={inputCls} type="email" placeholder="info@school.kidemia.net" value={form.email} onChange={e => set("email", e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Phone</label>
                                    <input className={inputCls} placeholder="+2348001234567" value={form.phone} onChange={e => set("phone", e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Website</label>
                                    <input className={inputCls} placeholder="https://school.kidemia.net" value={form.website} onChange={e => set("website", e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>City</label>
                                    <input className={inputCls} placeholder="Lagos" value={form.city} onChange={e => set("city", e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>State</label>
                                    <input className={inputCls} placeholder="Lagos" value={form.state} onChange={e => set("state", e.target.value)} />
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <label className={labelCls}>Description</label>
                                    <textarea className={inputCls} rows={2} placeholder="Brief description of the institution…" value={form.description} onChange={e => set("description", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Owner */}
                            <div>
                                <p className="text-sm font-semibold text-kidemia-primary mb-3 flex items-center gap-2">
                                    <GraduationCap size={15} className="text-kidemia-secondary" /> Institution Admin (Owner)
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <div>
                                        <label className={labelCls}>First Name *</label>
                                        <input className={inputCls} placeholder="Samuel" value={form.owner_first_name} onChange={e => set("owner_first_name", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Last Name *</label>
                                        <input className={inputCls} placeholder="Adeyemi" value={form.owner_last_name} onChange={e => set("owner_last_name", e.target.value)} />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className={labelCls}>Login Email *</label>
                                        <input className={inputCls} type="email" placeholder="samuel@greenfield.edu.ng" value={form.owner_email} onChange={e => set("owner_email", e.target.value)} />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.send_welcome_email}
                                                onChange={e => set("send_welcome_email", e.target.checked)}
                                                className="w-4 h-4 rounded accent-[#e07b39]"
                                            />
                                            <span className="text-sm text-kidemia-primary">Send welcome email with login credentials</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Access Settings */}
                            <div>
                                <p className="text-sm font-semibold text-kidemia-primary mb-3">Access Settings</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Tier</label>
                                        <select className={inputCls} value={form.tier} onChange={e => set("tier", e.target.value as TierKey)}>
                                            <option value="basic">Basic</option>
                                            <option value="premium">Premium</option>
                                            <option value="enterprise">Enterprise</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Max Students</label>
                                        <input className={inputCls} type="number" placeholder="Unlimited" value={form.max_students} onChange={e => set("max_students", e.target.value)} />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2 space-y-2">
                                        {toggleKeys.map(key => (
                                            <label key={key} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                                <span className="text-sm text-kidemia-primary">{toggleLabels[key]}</span>
                                                <div
                                                    onClick={() => set(key, !form[key] as OnboardForm[typeof key])}
                                                    className="w-10 h-5 rounded-full relative transition-colors cursor-pointer flex-shrink-0"
                                                    style={{ backgroundColor: form[key] ? 'kidemia-secondary' : "#e5e7eb" }}
                                                >
                                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form[key] ? "left-5" : "left-0.5"}`} />
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={step === 1 ? onClose : () => setStep(1)}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                        {step === 1 ? "Cancel" : "← Back"}
                    </button>
                    {step === 1 ? (
                        <button
                            onClick={() => setStep(2)}
                            disabled={!form.name || !form.code}
                            className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white disabled:opacity-40 transition-opacity bg-kidemia-secondary hover:bg-kidemia-secondary/100 flex items-center justify-center gap-2"
                        >
                            Next →
                        </button>
                    ) : <button type="button"
                        onClick={handleSubmit}
                        disabled={createInstitution.isPending || !form.owner_email || !form.owner_first_name || !form.owner_last_name}
                        className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white disabled:opacity-40 flex items-center justify-center gap-2 bg-kidemia-secondary"
                    >
                        {createInstitution.isPending
                            ? <><Loader2 size={15} className="animate-spin" /> Creating…</>
                            : "Onboard Institution"
                        }
                    </button>}
                </div>
            </div>
        </div>
    );
}
