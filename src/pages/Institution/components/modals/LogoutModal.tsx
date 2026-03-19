import { useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { clearAuthAtom } from "../../../../store/user.atom";
import { institutionAccessAtom } from "../../../../store/institution.atom";
import { AuthRoutes } from "../../../../routes";


export function LogoutModal({ onClose }: { onClose: () => void }) {
    const clearAuth = useSetAtom(clearAuthAtom);
    const setInstitutionAccess = useSetAtom(institutionAccessAtom);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        setInstitutionAccess(null);
        navigate(AuthRoutes.login, { replace: true });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                        <LogOut size={24} className="text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Sign out</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Are you sure you want to sign out of the institution portal?
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}