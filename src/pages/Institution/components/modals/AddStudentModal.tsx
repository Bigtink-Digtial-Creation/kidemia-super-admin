import { useState } from "react";
import { UserPlus, Search, CheckCircle, AlertCircle } from "lucide-react";
import { addToast } from "@heroui/react";
import { Modal } from "./modal";
import { Btn } from "..";
import { useAddStudent, useClassrooms, useLinkStudentAccount } from "../../../../hooks/useSchools";
import { ApiSDK } from "../../../../sdk";
import type { UserType } from "../../../../sdk/generated";
import { PiMagicWand } from "react-icons/pi";
import { useSubjectCategories } from "../../../../hooks/useCategories";

type Step = "lookup" | "link-confirm" | "create-form";

interface LookupResult {
    found: boolean;
    student_id?: string;
    full_name?: string;
    email?: string;
    has_institution: boolean;
    can_link: boolean;
    message?: string;
}

interface Form {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    date_of_birth: string;
    guardian_email: string;
    classroom_id: string;
    send_invite: boolean;
    password: string;
    category_name: string;
}

export function AddStudentModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<Step>("lookup");
    const [query, setQuery] = useState("");
    const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
    const [isLooking, setIsLooking] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [sendInvite, setSendInvite] = useState(true);
    const [form, setForm] = useState<Form>({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        date_of_birth: "",
        guardian_email: "",
        classroom_id: "",
        send_invite: true,
        password: "",
        category_name: "",
    });

    const generatePassword = (length = 8) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let pass = "";
        for (let i = 0; i < length; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    };

    const { data: classrooms } = useClassrooms();
    const { data: categories } = useSubjectCategories();
    const addStudent = useAddStudent();
    const linkStudentAccount = useLinkStudentAccount();

    const update = (key: keyof Form, value: string | boolean) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleLookup = async () => {
        if (!query.trim()) return;
        setIsLooking(true);
        try {
            const result = await ApiSDK.InstitutionService.
                lookupStudentApiV1InstitutionInstitutionIdStudentsLookupGet(
                    query.trim()
                );
            setLookupResult(result);

            if (result.found && result.can_link) {
                setStep("link-confirm");
            } else if (!result.found) {
                if (query.includes("@")) {
                    setForm((f) => ({ ...f, email: query.trim() }));
                }
                setStep("create-form");
            }
        } catch (err: any) {
            addToast({
                title: "Lookup failed",
                description: err?.body?.detail || err?.message,
                color: "danger",
            });
        } finally {
            setIsLooking(false);
        }
    };

    const handleLink = () => {
        if (!lookupResult?.student_id) return;
        linkStudentAccount.mutate(
            {
                data: {
                    student_id: lookupResult.student_id,
                    classroom_id: selectedClassId,
                },
            },
            {
                onSuccess: () => {
                    addToast({
                        title: `${lookupResult.full_name} linked to institution`,
                        color: "success",
                    });
                    onClose();
                },
                onError: (err: any) => {
                    addToast({
                        title: "Failed to link student",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    const handleCreate = () => {
        addStudent.mutate(
            {
                data: {
                    email: form.email,
                    first_name: form.first_name,
                    last_name: form.last_name,
                    phone_number: form.phone_number || undefined,
                    date_of_birth: form.date_of_birth || undefined,
                    guardian_email: form.guardian_email || undefined,
                    classroom_id: form.classroom_id || undefined,
                    category: form.category_name,
                    user_type: "student" as UserType,
                    password: form.password,
                },
                sendInvite: form.send_invite,
            },
            {
                onSuccess: () => {
                    addToast({
                        title: `${form.first_name} ${form.last_name} added`,
                        color: "success",
                    });
                    onClose();
                },
                onError: (err: any) => {
                    addToast({
                        title: "Failed to add student",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    const classroomSelect = (value: string, onChange: (v: string) => void) => (
        <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Assign to classroom
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
                <option value="">No classroom (assign later)</option>
                {classrooms?.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name} — {c.level}
                    </option>
                ))}
            </select>
        </div>
    );


    if (step === "lookup") {
        return (
            <Modal
                title="Add Student"
                subtitle="Search by email or student code first"
                onClose={onClose}
                footer={
                    <div className="flex gap-3">
                        <Btn variant="secondary" onClick={onClose} fullWidth>
                            Cancel
                        </Btn>
                        <Btn
                            disabled={!query.trim() || isLooking}
                            onClick={handleLookup}
                            fullWidth
                        >
                            Search
                        </Btn>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="relative">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Email address or student code…"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setLookupResult(null);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                            className="w-full pl-9 pr-4 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>

                    {lookupResult && !lookupResult.found && (
                        <div className="flex items-start gap-2.5 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">No existing student found</p>
                                <p className="text-blue-500 mt-0.5">
                                    You can create a new account for this student.
                                </p>
                                <button
                                    onClick={() => setStep("create-form")}
                                    className="mt-2 text-blue-600 font-semibold hover:underline"
                                >
                                    Create new student →
                                </button>
                            </div>
                        </div>
                    )}

                    {lookupResult?.found && !lookupResult.can_link && (
                        <div className="flex items-start gap-2.5 bg-red-50 rounded-xl p-3 text-xs text-red-700">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">{lookupResult.full_name}</p>
                                <p className="text-red-500 mt-0.5">{lookupResult.message}</p>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-gray-400 text-center">
                        Student not on the platform yet?{" "}
                        <button
                            onClick={() => setStep("create-form")}
                            className="text-orange-500 font-medium hover:underline"
                        >
                            Create new account
                        </button>
                    </p>
                </div>
            </Modal>
        );
    }

    if (step === "link-confirm" && lookupResult) {
        return (
            <Modal
                title="Link Student"
                subtitle="Confirm you want to add this student"
                onClose={onClose}
                footer={
                    <div className="flex gap-3">
                        <Btn
                            variant="secondary"
                            onClick={() => {
                                setStep("lookup");
                                setLookupResult(null);
                            }}
                            fullWidth
                        >
                            Back
                        </Btn>
                        <Btn
                            icon={<UserPlus size={14} />}
                            disabled={linkStudentAccount.isPending}
                            onClick={handleLink}
                            fullWidth
                        >
                            Link to Institution
                        </Btn>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={18} className="text-green-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-800">
                                {lookupResult.full_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {lookupResult.email}
                            </p>
                            <p className="text-xs text-green-600 mt-0.5">
                                Existing student · No institution
                            </p>
                        </div>
                    </div>

                    {classroomSelect(selectedClassId, setSelectedClassId)}

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <div
                            onClick={() => setSendInvite((v) => !v)}
                            className="w-10 h-5 rounded-full transition-colors flex items-center flex-shrink-0"
                            style={{ backgroundColor: sendInvite ? "#e07b39" : "#e5e7eb" }}
                        >
                            <span
                                className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${sendInvite ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </div>
                        <span className="text-sm text-gray-600">
                            Notify student via email
                        </span>
                    </label>
                </div>
            </Modal>
        );
    }

    // ── Render: Create form step ──────────────────────────────────
    return (
        <Modal
            title="New Student"
            subtitle="Create a new student account"
            onClose={onClose}
            footer={
                <div className="flex gap-3">
                    <Btn
                        variant="secondary"
                        onClick={() => setStep("lookup")}
                        fullWidth
                    >
                        Back
                    </Btn>
                    <Btn
                        icon={<UserPlus size={14} />}
                        disabled={
                            !form.email || !form.first_name || !form.last_name ||
                            addStudent.isPending
                        }
                        onClick={handleCreate}
                        fullWidth
                    >
                        Create & Enrol
                    </Btn>
                </div>
            }
        >
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            First name *
                        </label>
                        <input
                            type="text"
                            placeholder="John"
                            value={form.first_name}
                            onChange={(e) => update("first_name", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Last name *
                        </label>
                        <input
                            type="text"
                            placeholder="Doe"
                            value={form.last_name}
                            onChange={(e) => update("last_name", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Email *
                    </label>
                    <input
                        type="email"
                        placeholder="student@example.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                </div>

                <div className="relative">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Password *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter password"
                        value={form.password || ""}
                        onChange={(e) => update("password", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            const newPass = generatePassword(8);
                            update("password", newPass);
                            navigator.clipboard.writeText(newPass);
                            addToast({
                                title: "Password generated",
                                description: "Password copied to clipboard",
                                color: "success",
                            });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <PiMagicWand size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Phone
                        </label>
                        <input
                            type="tel"
                            placeholder="08012345678"
                            value={form.phone_number}
                            onChange={(e) => update("phone_number", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Date of birth
                        </label>
                        <input
                            type="date"
                            value={form.date_of_birth}
                            onChange={(e) => update("date_of_birth", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Guardian email
                    </label>
                    <input
                        type="email"
                        placeholder="parent@example.com"
                        value={form.guardian_email}
                        onChange={(e) => update("guardian_email", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                </div>

                {/* Category and Classroom side by side */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Category *
                        </label>
                        <select
                            value={form.category_name}
                            onChange={(e) => update("category_name", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                        >
                            <option value="">Select Category</option>
                            {categories?.filter((c) => c.is_active).map((c) => (
                                <option key={c.id} value={c.category_name}>
                                    {c.display_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Classroom
                        </label>
                        <select
                            value={form.classroom_id}
                            onChange={(e) => update("classroom_id", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                        >
                            <option value="">Assign later</option>
                            {classrooms?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} — {c.level}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
                    <div
                        onClick={() => update("send_invite", !form.send_invite)}
                        className="w-10 h-5 rounded-full transition-colors flex items-center flex-shrink-0"
                        style={{
                            backgroundColor: form.send_invite ? "#e07b39" : "#e5e7eb",
                        }}
                    >
                        <span
                            className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.send_invite ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </div>
                    <span className="text-sm text-gray-600">
                        Send invite email to student
                    </span>
                </label>
            </div>
        </Modal>
    );
}