import { Menu } from "lucide-react";
import { useAtomValue } from "jotai";
import { navItems } from "./Sidebar";
import { currentUserAtom, userFullNameAtom } from "../../../store/user.atom";
import { getNameIntials } from "../../../utils";

interface TopbarProps {
    activeView: string;
    onMenuOpen: () => void;
    onNavigate: (view: string) => void;
}

export function Topbar({ activeView, onMenuOpen, onNavigate }: TopbarProps) {
    const current = navItems.find((n) => n.id === activeView);
    const user = useAtomValue(currentUserAtom);
    const fullName = useAtomValue(userFullNameAtom);
    const initials = getNameIntials(fullName) ?? "?";

    return (
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0 gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onMenuOpen}
                    className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                    <Menu size={18} className="text-gray-500" />
                </button>
                <div className="min-w-0">
                    <h1 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                        {current?.label || "Dashboard"}
                    </h1>
                    <p className="text-xs text-gray-400 hidden sm:block">
                        Institution Portal
                    </p>
                </div>
            </div>

            {/* Avatar — click to go to profile view */}
            <button
                onClick={() => onNavigate("profile")}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
                title="My profile"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                        {fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-400">
                        {user?.roles?.[0]?.name ?? "Staff"}
                    </p>
                </div>
                {user?.profile_picture_url ? (
                    <img
                        src={user.profile_picture_url}
                        alt={fullName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-orange-100"
                    />
                ) : (
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center 
                        bg-kidemia-secondary text-white text-xs font-bold flex-shrink-0"

                    >
                        {initials}
                    </div>
                )}
            </button>
        </header>
    );
}