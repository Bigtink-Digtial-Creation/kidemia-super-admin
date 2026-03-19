import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { Camera, Save, Mail, Phone, Calendar, FileText, User } from "lucide-react";
import { userFullNameAtom } from "../../store/user.atom";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { getNameIntials } from "../../utils";
import { apiErrorParser } from "../../utils/errorParser";
import type { UserResponse } from "../../sdk/generated";


interface ProfileForm {
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    date_of_birth: string;
    bio: string;
    profile_picture_url: string;
}

function Field({
    label,
    children,
    icon: Icon,
}: {
    label: string;
    children: React.ReactNode;
    icon?: React.ElementType;
}) {
    return (
        <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                )}
                {children}
            </div>
        </div>
    );
}

const inputCls = (hasIcon = false) =>
    `w-full border border-gray-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white ${hasIcon ? "pl-9 pr-3" : "px-3"
    }`;

export function InstitutionProfileView() {
    const queryClient = useQueryClient();
    // const storedUser = useAtomValue(loggedinUserAtom);
    const fullName = useAtomValue(userFullNameAtom);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [form, setForm] = useState<ProfileForm>({
        first_name: "",
        last_name: "",
        middle_name: "",
        phone_number: "",
        date_of_birth: "",
        bio: "",
        profile_picture_url: "",
    });

    const update = (key: keyof ProfileForm, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const { data: user, isLoading } = useQuery<UserResponse>({
        queryKey: [QueryKeys.user],
        queryFn: () =>
            ApiSDK.AuthenticationService.getCurrentUserApiV1AuthMeGet(),
    });

    useEffect(() => {
        if (user) {
            setAvatarUrl(user.profile_picture_url ?? null);
            setForm({
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                middle_name: user.middle_name ?? "",
                phone_number: user.phone_number ?? "",
                date_of_birth: user.date_of_birth ?? "",
                bio: user.bio ?? "",
                profile_picture_url: user.profile_picture_url ?? "",
            });
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: (data: Partial<ProfileForm>) =>
            ApiSDK.AuthenticationService.updateAccountApiV1AuthAccountUserIdPatch(
                user?.id as string,
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.user] });
            addToast({ title: "Profile updated", color: "success" });
        },
        onError: (err) => {
            addToast({
                title: "Update failed",
                description: apiErrorParser(err).message,
                color: "danger",
            });
        },
    });

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            addToast({ title: "Invalid file type", color: "danger" });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            addToast({ title: "File must be under 10MB", color: "danger" });
            return;
        }

        setIsUploading(true);
        try {
            const res =
                await ApiSDK.UploadService.updateAvatarApiV1ApiUploadAccountAvatarPatch(
                    { file }
                );
            setAvatarUrl(res.url);
            updateMutation.mutate({ profile_picture_url: res.url });
        } catch (err) {
            addToast({ title: "Upload failed", color: "danger" });
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4 max-w-2xl animate-pulse">
                <div className="bg-white rounded-2xl h-48 border border-gray-100" />
                <div className="bg-white rounded-2xl h-64 border border-gray-100" />
            </div>
        );
    }

    const initials = getNameIntials(fullName) ?? "?";

    return (
        <div className="space-y-5 max-w-2xl">
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    My Profile
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                    Manage your personal information
                </p>
            </div>


            {/* Avatar card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="relative flex-shrink-0">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={fullName}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-100"
                            />
                        ) : (
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center
                                 justify-center bg-kidemia-secondary text-white text-xl font-bold"

                            >
                                {initials}
                            </div>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        <label
                            htmlFor="institution-avatar"
                            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 
                            rounded-xl flex items-center justify-center text-white 
                            cursor-pointer shadow-md bg-kidemia-secondary transition-colors hover:opacity-90"
                            title="Change photo"
                        >
                            <Camera size={14} />
                            <input
                                id="institution-avatar"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleAvatarChange}
                                disabled={isUploading}
                            />
                        </label>
                    </div>

                    <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-lg leading-tight">
                            {fullName || "—"}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">
                            {user?.roles?.[0]?.name ?? "Staff"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Mail size={11} />
                            {user?.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
                        <User size={12} className="text-orange-500" />
                    </div>
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="First name" icon={User}>
                        <input
                            value={form.first_name}
                            onChange={(e) => update("first_name", e.target.value)}
                            className={inputCls(true)}
                        />
                    </Field>
                    <Field label="Last name" icon={User}>
                        <input
                            value={form.last_name}
                            onChange={(e) => update("last_name", e.target.value)}
                            className={inputCls(true)}
                        />
                    </Field>
                </div>

                <Field label="Middle name" icon={User}>
                    <input
                        value={form.middle_name}
                        onChange={(e) => update("middle_name", e.target.value)}
                        className={inputCls(true)}
                    />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Phone number" icon={Phone}>
                        <input
                            type="tel"
                            value={form.phone_number}
                            onChange={(e) => update("phone_number", e.target.value)}
                            placeholder="+234 800 000 0000"
                            className={inputCls(true)}
                        />
                    </Field>
                    <Field label="Date of birth" icon={Calendar}>
                        <input
                            type="date"
                            value={form.date_of_birth}
                            onChange={(e) => update("date_of_birth", e.target.value)}
                            className={inputCls(true)}
                        />
                    </Field>
                </div>

                <Field label="Bio" icon={FileText}>
                    <textarea
                        value={form.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        rows={3}
                        placeholder="Tell us a little about yourself…"
                        className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    />
                </Field>
            </div>

            {/* Read-only account info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Mail size={12} className="text-gray-400" />
                    </div>
                    Account Info
                    <span className="text-xs font-normal text-gray-400 ml-1">
                        (read-only)
                    </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Email
                        </label>
                        <input
                            value={user?.email ?? ""}
                            readOnly
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Account type
                        </label>
                        <input
                            value={user?.user_type ?? ""}
                            readOnly
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 capitalize"
                        />
                    </div>
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button
                    onClick={() => updateMutation.mutate(form)}
                    disabled={updateMutation.isPending || isUploading}
                    className="flex items-center gap-2 px-5 py-2.5 
                    rounded-xl text-sm font-medium bg-kidemia-secondary text-white
                     disabled:opacity-50 transition-colors"
                >
                    <Save size={14} />
                    {updateMutation.isPending ? "Saving…" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}