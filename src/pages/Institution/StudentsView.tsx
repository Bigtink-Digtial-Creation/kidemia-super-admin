import { useState } from "react";
import { Search, Upload, UserPlus } from "lucide-react";
import { useClassrooms, useInstitutionStudents } from "../../hooks/useSchools";
import { type ModalType } from "./components/modals";
import { Badge, Avatar } from "./components/index";
import RemoveStudentButton from "./components/RemoveStudentButton";

interface StudentsViewProps {
    onModal: (m: ModalType) => void;
}

export function StudentsView({ onModal }: StudentsViewProps) {
    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("");

    const { data: students, isLoading } = useInstitutionStudents({
        page: 0,
        limit: 100,
    });

    const { data: classrooms } = useClassrooms();

    const filtered = (students || []).filter(s => {
        const matchSearch =
            s.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            s.student_code?.toLowerCase().includes(search.toLowerCase());

        const matchClass = !classFilter || s.classroom?.name === classFilter;

        return matchSearch && matchClass;
    });

    return (
        <div className="space-y-5">
            {/* Restored Header with Onboarding Buttons */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Students</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        {isLoading ? "Fetching records..." : `${students?.length || 0} total students enrolled`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onModal("bulk")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-all bg-white"
                    >
                        <Upload size={14} className="text-orange-500" /> Bulk Onboard
                    </button>
                    <button
                        onClick={() => onModal("addStudent")}
                        className="flex items-center gap-1.5 px-3
                         sm:px-4 py-2 rounded-xl text-xs sm:text-sm
                          font-medium bg-kidemia-secondary text-white shadow-md 
                          hover:opacity-90 transition-all"
                    >
                        <UserPlus size={14} /> Add Student
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[160px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or student code..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                </div>

                <select
                    value={classFilter}
                    onChange={e => setClassFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                >
                    <option value="">All Classes</option>
                    {classrooms?.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-5 py-3.5 font-medium">Student</th>
                                <th className="px-5 py-3.5 font-medium">Code</th>
                                <th className="px-5 py-3.5 font-medium">Class</th>
                                <th className="px-5 py-3.5 font-medium">Learning Path</th>
                                <th className="px-5 py-3.5 font-medium">Status</th>
                                <th className="px-5 py-3.5 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">

                            {filtered.map(s => (

                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <Avatar name={s.user.full_name} size="sm" />
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-800 truncate">{s.user.full_name}</p>
                                                <p className="text-[10px] text-gray-400 truncate">{s.user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{s.student_code || '---'}</td>
                                    <td className="px-5 py-3.5 text-gray-600 text-xs">{s.classroom?.name || 'Unassigned'}</td>
                                    <td className="px-5 py-3.5">
                                        <Badge >
                                            {s.path}
                                        </Badge>
                                    </td>

                                    <td className="px-5 py-3.5">
                                        <Badge variant={s.is_active ? "green" : "gray"}>
                                            {s.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <RemoveStudentButton studentId={s.id} studentName={s.user.full_name} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isLoading && (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mb-2"></div>
                        <p className="text-gray-400 text-sm">Loading student directory...</p>
                    </div>
                )}

                {!isLoading && filtered.length === 0 && (
                    <div className="p-12 text-center text-gray-400 text-sm">
                        No students found.
                    </div>
                )}
            </div>
        </div>
    );
}