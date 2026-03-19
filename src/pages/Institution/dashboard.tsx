import { useState } from "react";
import { navItems, Sidebar, type InstitutionRole } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { ClassroomsView } from "./ClassroomsView";
import { StudentsView } from "./StudentsView";
import { TeachersView } from "./TeachersView";
import { AssessmentsView } from "./AssessmentsView";
import { AnalyticsView } from "./AnalyticsView";
import { SettingsView } from "./SettingsView";
import {
    BulkUploadModal,
    MoveStudentModal,
    AssignAssessmentModal,
    AddTeacherModal,
    GenerateReportModal,
    NewClassroomModal,
    type ModalType,
} from "./components/modals";
import { OverviewView } from "./Overview";
import { AddStudentModal } from "./components/modals/AddStudentModal";
import { StudentGroupsView } from "./StudentGroupsView";
import { InstitutionProfileView } from "./InstitutionProfileView";
import { institutionAccessAtom } from "../../store/institution.atom";
import { useAtomValue } from "jotai";

export default function InstitutionDashboard() {
    const [view, setView] = useState("overview");
    const [modal, setModal] = useState<{ type: ModalType; elementId?: string; } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const openModal = (type: ModalType, elementId?: string) => {
        setModal({ type, elementId });
    };

    const institutionAccess = useAtomValue(institutionAccessAtom);
    const role = (institutionAccess?.role ?? "staff") as InstitutionRole;




    (newView: string) => {
        const item = navItems.find((n) => n.id === newView);
        if (item?.allowedRoles && !item.allowedRoles.includes(role)) {
            setView("overview");
            return;
        }
        setView(newView);
    };
    return (

        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <Sidebar
                activeView={view}
                onNavigate={setView}
                mobileOpen={sidebarOpen}
                onMobileClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Topbar activeView={view}
                    onMenuOpen={() => setSidebarOpen(true)} onNavigate={setView} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {view === "overview" && <OverviewView onModal={openModal} />}
                    {view === "classrooms" && <ClassroomsView onModal={openModal} />}
                    {view === "students" && <StudentsView onModal={openModal} />}
                    {view === "studentsGroup" && <StudentGroupsView />}
                    {view === "teachers" && <TeachersView onModal={openModal} />}
                    {view === "assessments" && <AssessmentsView onModal={openModal} />}
                    {view === "analytics" && <AnalyticsView onModal={openModal} />}
                    {view === "settings" && <SettingsView />}
                    {view === "profile" && <InstitutionProfileView />}

                </main>
            </div>

            {modal?.type === "bulk" && <BulkUploadModal onClose={() => setModal(null)} />}
            {modal?.type === "move" && <MoveStudentModal classId={modal.elementId!} onClose={() => setModal(null)} />}
            {modal?.type === "assign" && <AssignAssessmentModal onClose={() => setModal(null)} />}
            {modal?.type === "addTeacher" && <AddTeacherModal onClose={() => setModal(null)} />}
            {modal?.type === "report" && <GenerateReportModal onClose={() => setModal(null)} />}
            {modal?.type === "newClassroom" && <NewClassroomModal onClose={() => setModal(null)} />}
            {modal?.type === "addStudent" && <AddStudentModal onClose={() => setModal(null)} />}


        </div>
    );
}