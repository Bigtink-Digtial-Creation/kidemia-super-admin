import {
    Home, LayoutGrid, Users, GraduationCap, ClipboardList,
    BarChart2, Settings, LogOut, CheckCircle, X, Group,
} from "lucide-react";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { currentUserAtom, userFullNameAtom } from "../../../store/user.atom";
import { institutionAccessAtom } from "../../../store/institution.atom";
import { getNameIntials } from "../../../utils";
import { LogoutModal } from "./modals/LogoutModal";
import { PiCarProfile } from "react-icons/pi";
import { useInstitutionProfile } from "../../../hooks/useSchools";

type InstitutionRole = "owner" | "staff";

const navItems = [
    {
        id: "overview",
        label: "Dashboard",
        icon: Home,
    },
    {
        id: "classrooms",
        label: "Classrooms",
        icon: LayoutGrid,
        allowedRoles: ["owner", "staff"] as InstitutionRole[],
    },
    {
        id: "students",
        label: "Students",
        icon: Users,
    },
    {
        id: "studentsGroup",
        label: "Student Groups",
        icon: Group,
        allowedRoles: ["owner", "staff"] as InstitutionRole[],
    },
    {
        id: "teachers",
        label: "Teachers",
        icon: GraduationCap,
        allowedRoles: ["owner"] as InstitutionRole[],
    },
    {
        id: "assessments",
        label: "Assessments",
        icon: ClipboardList,
    },
    {
        id: "analytics",
        label: "Analytics",
        icon: BarChart2,
        allowedRoles: ["owner"] as InstitutionRole[],

    },
    {
        id: "settings",
        label: "Settings",
        icon: Settings,
        allowedRoles: ["owner"] as InstitutionRole[], // owner only
    },
    {
        id: "profile",
        label: "My Profile",
        icon: PiCarProfile,
    },
];

// Export the type so InstitutionDashboard can use it for view gating too
export { navItems };
export type { InstitutionRole };

interface SidebarProps {
    activeView: string;
    onNavigate: (view: string) => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

export function Sidebar({
    activeView,
    onNavigate,
    mobileOpen,
    onMobileClose,
}: SidebarProps) {
    const [showLogout, setShowLogout] = useState(false);
    const user = useAtomValue(currentUserAtom);
    const fullName = useAtomValue(userFullNameAtom);
    const institutionAccess = useAtomValue(institutionAccessAtom);
    const { data: institutionProfile } = useInstitutionProfile();

    const initials = getNameIntials(fullName) ?? "?";
    const role = (institutionAccess?.role ?? "staff") as InstitutionRole;

    const roleLabel =
        role === "owner"
            ? "Institution Owner"
            : role === "staff"
                ? "Institution Staff"
                : "Staff";

    // Filter nav items based on current role
    const visibleNavItems = navItems.filter((item) =>
        !item.allowedRoles || item.allowedRoles.includes(role)
    );

    const handleNav = (id: string) => {
        onNavigate(id);
        onMobileClose();
    };

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100
          flex flex-col shadow-lg z-40 transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:shadow-sm lg:flex-shrink-0
        `}
            >
                {/* Institution name */}
                <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-kidemia-secondary">
                            <GraduationCap size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-sm leading-tight truncate">
                                {institutionProfile?.name ?? "Institution"}
                            </p>
                            <p className="text-xs text-gray-400">Management Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                    ? "text-white shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                    }`}
                                style={active ? { backgroundColor: "#e07b39" } : {}}
                            >
                                <Icon size={16} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Plan badge */}
                <div className="px-3 pb-3">
                    <div className="bg-green-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-green-700">
                                {institutionProfile?.tier?.toUpperCase() ?? "BASIC"} Plan
                            </p>
                            <p className="text-xs text-green-500">{roleLabel}</p>
                        </div>
                    </div>
                </div>

                {/* User row */}
                <div className="px-3 pb-4 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-3 px-2">
                        {user?.profile_picture_url ? (
                            <img
                                src={user.profile_picture_url}
                                alt={fullName}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-kidemia-secondary text-white font-bold text-xs flex-shrink-0">
                                {initials}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {fullName || "User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{roleLabel}</p>
                        </div>
                        <button
                            onClick={() => setShowLogout(true)}
                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                            title="Sign out"
                        >
                            <LogOut size={14} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </aside>

            {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}
        </>
    );
}