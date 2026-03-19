import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useRemoveStudent } from "../../../hooks/useSchools";
import { addToast } from "@heroui/react";

export default function RemoveStudentButton({
    studentId,
    studentName,
}: {
    studentId: string;
    studentName: string;
}) {
    const [confirming, setConfirming] = useState(false);
    const removeStudent = useRemoveStudent();

    if (confirming) {
        return (
            <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs text-gray-500">Remove?</span>
                <button
                    onClick={() => {
                        removeStudent.mutate(studentId, {
                            onSuccess: () => {
                                addToast({
                                    title: `${studentName} removed`,
                                    color: "success",
                                });
                            },
                            onError: (err: any) => {
                                addToast({
                                    title: "Failed to remove student",
                                    description: err?.body?.detail || err?.message,
                                    color: "danger",
                                });
                            },
                        });
                        setConfirming(false);
                    }}
                    className="text-xs text-red-500 font-medium hover:underline"
                >
                    Yes
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="text-xs text-gray-400 hover:underline"
                >
                    No
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors group"
        >
            <MoreVertical
                size={15}
                className="text-gray-400 group-hover:text-red-400"
            />
        </button>
    );
}