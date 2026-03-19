import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInstitution } from "../context/InstitutionContext";
import { ApiSDK } from "../sdk";
import { OpenAPI, type AssessmentDetailResponse, type AssignAssessmentRequest, type Body_bulk_upload_students_api_v1_institution_students_bulk_upload_post, type BulkMoveStudentsRequest, type ClassroomCreate, type ClassroomResponse, type ClassroomUpdate, type InstitutionAssessmentCreate, type InstitutionAssessmentResponse, type InstitutionDashboardStats, type InstitutionProfileResponse, type InstitutionUpdateRequest, type LinkStudent, type MoveStudentRequest, type RegisterRequest, type StudentGroupCreate, type StudentGroupResponse, type StudentGroupUpdate, type StudentWithClassroomResponse, type TeacherInviteRequest } from "../sdk/generated";
import { institutionKeys } from "../utils/queryKeys";
import { getAuthHeaders } from "../utils";

export const useInstitutionStats = () => {
    const { institutionId } = useInstitution();

    return useQuery<InstitutionDashboardStats>({
        queryKey: institutionKeys.analytics(institutionId),
        queryFn: () =>
            ApiSDK.InstitutionService.getDashboardApiV1InstitutionDashboardGet(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};




export const useClassrooms = () => {
    const { institutionId } = useInstitution();
    return useQuery<ClassroomResponse[]>({
        queryKey: institutionKeys.classrooms(institutionId),
        queryFn: () => ApiSDK.InstitutionService.listClassroomsApiV1InstitutionClassroomsGet(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export const useCreateClassroom = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ClassroomCreate) =>
            ApiSDK.InstitutionService.createClassroomApiV1InstitutionClassroomsPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.classrooms(institutionId),
            });
            // Also invalidate stats since total_classrooms changes
            queryClient.invalidateQueries({
                queryKey: institutionKeys.analytics(institutionId),
            });
        },
    });
};

export const useUpdateClassroom = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ classroomId, data }: { classroomId: string; data: ClassroomUpdate }) =>
            ApiSDK.InstitutionService.updateClassroomApiV1InstitutionClassroomsClassroomIdPatch(classroomId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.classrooms(institutionId),
            });
        },
    });
};

export const useMoveStudent = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: MoveStudentRequest) =>
            ApiSDK.InstitutionService.moveStudentToClassroomApiV1InstitutionClassroomsMoveStudentPost(req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.classrooms(institutionId),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.students(institutionId),
            });
        },
    });
};

export const useBulkMoveStudents = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: BulkMoveStudentsRequest) =>
            ApiSDK.InstitutionService.bulkMoveStudentsApiV1InstitutionClassroomsBulkMoveStudentsPost(req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.classrooms(institutionId),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.students(institutionId),
            });
        },
    });
};




export const useInstitutionTeachers = () => {
    const { institutionId } = useInstitution();
    return useQuery({
        queryKey: institutionKeys.teachers(institutionId),
        queryFn: () => ApiSDK.InstitutionService.listTeachersApiV1InstitutionTeachersGet(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export const useInviteTeacher = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TeacherInviteRequest) =>
            ApiSDK.InstitutionService.inviteTeacherApiV1InstitutionTeachersInvitePost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.teachers(institutionId),
            });
        },
    });
};

export const useSuspendTeacher = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ teacherId, suspend }: { teacherId: string; suspend: boolean }) =>
            ApiSDK.InstitutionService.
                suspendTeacherApiV1InstitutionTeachersTeacherIdSuspendPatch(teacherId, suspend),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.teachers(institutionId),
            });
        },
    });
};


export const useAssignTeacherToClassroom = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            teacherId,
            classroomId,
            subject,
            isClassTeacher,
        }: {
            teacherId: string;
            classroomId: string;
            subject: string | null;
            isClassTeacher: boolean | undefined
        }) =>
            ApiSDK.InstitutionService.assignTeacherToClassroomApiV1InstitutionTeachersTeacherIdAssignPatch(
                teacherId,
                classroomId,
                subject,
                isClassTeacher
            ),
        onSuccess: () => {
            // Both teachers and classrooms are affected
            queryClient.invalidateQueries({
                queryKey: institutionKeys.teachers(institutionId),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.classrooms(institutionId),
            });
        },
    });
};

export const useInstitutionStudents = (filters: { page?: number; limit?: number; search?: string } = {}) => {
    const { institutionId } = useInstitution();
    const page = filters.page ?? 0;
    const limit = filters.limit ?? 100;

    return useQuery({
        queryKey: [...institutionKeys.students(institutionId), { page, limit, search: filters.search }],
        queryFn: () =>
            ApiSDK.InstitutionService.getDetailedStudentsApiV1InstitutionStudentsDetailedGet(
                page * limit,
                limit,
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!institutionId,
    });
};


export const useClassroomStudents = (classroomId: string | null) => {
    const { institutionId } = useInstitution();
    return useQuery<StudentWithClassroomResponse[]>({
        queryKey: institutionKeys.classroomStudents(institutionId, classroomId!),
        queryFn: () =>
            ApiSDK.InstitutionService.
                getClassroomStudentsApiV1InstitutionClassroomsClassroomIdStudentsGet(classroomId!, 0, 100),
        enabled: !!classroomId,
        staleTime: 1000 * 60 * 5,
    });
};

export const useRemoveStudent = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (studentId: string) =>
            ApiSDK.InstitutionService.removeStudentFromInstitutionApiV1InstitutionInstitutionIdStudentsStudentIdDelete(
                institutionId,
                studentId
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.students(institutionId),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.analytics(institutionId),
            });
        },
    });
};

// link student account
export const useLinkStudentAccount = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            data
        }: {
            data: LinkStudent;
        }) =>
            ApiSDK.
                InstitutionService.
                linkStudentApiV1InstitutionInstitutionIdStudentsLinkPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.students(institutionId),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.analytics(institutionId),
            });
        },
    });
};

// Single student onboard
export const useAddStudent = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            data,
            sendInvite,
        }: {
            data: RegisterRequest;
            sendInvite: boolean;
        }) =>
            ApiSDK.
                InstitutionService.
                addSingleStudentApiV1InstitutionInstitutionIdStudentsPost(institutionId, data, sendInvite),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.students(institutionId),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.analytics(institutionId),
            });
        },
    });
};

// Bulk upload
export const useBulkUploadStudents = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ file, sendInvite }: { file: Body_bulk_upload_students_api_v1_institution_students_bulk_upload_post; sendInvite: boolean }) => {
            return ApiSDK.InstitutionService.bulkUploadStudentsApiV1InstitutionStudentsBulkUploadPost(
                file,
                sendInvite
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.students(institutionId),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.analytics(institutionId),
            });
        },
    });
};


// ── Student Groups ────────────────────────────────────────────────

export const useClassroomGroups = (classroomId: string | null) => {
    const { institutionId } = useInstitution();
    return useQuery<StudentGroupResponse[]>({
        queryKey: institutionKeys.classroomGroups(institutionId, classroomId!),
        queryFn: () =>
            ApiSDK.InstitutionService.listStudentGroupsApiV1InstitutionClassroomsClassroomIdGroupsGet(classroomId!),
        enabled: !!classroomId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export const useAllGroups = () => {
    const { institutionId } = useInstitution();
    return useQuery<StudentGroupResponse[]>({
        queryKey: institutionKeys.groups(institutionId),
        queryFn: () => ApiSDK.InstitutionService.listAllGroupsApiV1InstitutionGroupsGet(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export const useCreateGroup = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: StudentGroupCreate) =>
            ApiSDK.InstitutionService.createStudentGroupApiV1InstitutionClassroomsClassroomIdGroupsPost(data.classroom_id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.classroomGroups(institutionId, variables.classroom_id),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.groups(institutionId),
            });
        },
    });
};

export const useUpdateGroup = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            groupId,
            data,
        }: {
            groupId: string;
            classroomId: string;
            data: StudentGroupUpdate;
        }) => ApiSDK.InstitutionService.updateStudentGroupApiV1InstitutionGroupsGroupIdPatch(groupId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.classroomGroups(institutionId, variables.classroomId),
            });
            queryClient.invalidateQueries({
                queryKey: institutionKeys.groups(institutionId),
            });
        },
    });
};



// ── Institution Assessments ───────────────────────────────────────

export const useInstitutionAssessments = () => {
    const { institutionId } = useInstitution();
    return useQuery<InstitutionAssessmentResponse[]>({
        queryKey: institutionKeys.assessments(institutionId),
        queryFn: () =>
            ApiSDK.InstitutionService.listInstitutionAssessmentsApiV1InstitutionAssessmentsGet(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export const useCreateInstitutionAssessment = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: InstitutionAssessmentCreate) =>
            ApiSDK.InstitutionService.createInstitutionAssessmentApiV1InstitutionAssessmentsPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: institutionKeys.assessments(institutionId),
            });
        },
    });
};

export const useAssignAssessment = () => {
    return useMutation({
        mutationFn: (data: AssignAssessmentRequest) => ApiSDK.InstitutionService.assignAssessmentApiV1InstitutionAssessmentsAssignPost(data),
    });
};

export const useAssessmentDetail = (assessmentId: string | null) => {
    const { institutionId } = useInstitution();
    return useQuery<AssessmentDetailResponse>({
        queryKey: ["institution", institutionId, "assessment-detail", assessmentId],
        queryFn: () =>
            ApiSDK.InstitutionService.
                getAssessmentDetailApiV1InstitutionAssessmentsAssessmentIdDetailGet(assessmentId!),
        enabled: !!assessmentId,
        staleTime: 1000 * 60 * 2, // 2 mins — submission status changes frequently
    });
};



export const useInstitutionAnalytics = () => {
    const { institutionId } = useInstitution();
    return useQuery({
        queryKey: ["institution", institutionId, "analytics"],
        queryFn: () => ApiSDK.InstitutionService.getInstitutionAnalyticsApiV1InstitutionAnalyticsGet(),
        staleTime: 1000 * 60 * 5,
    });
};

export const useClassroomAnalytics = (classroomId: string | null) => {
    const { institutionId } = useInstitution();
    return useQuery({
        queryKey: ["institution", institutionId, "analytics", "classroom", classroomId],
        queryFn: () =>
            ApiSDK.InstitutionService.
                getClassroomAnalyticsApiV1InstitutionAnalyticsClassroomsClassroomIdGet(classroomId!),
        enabled: !!classroomId,
        staleTime: 1000 * 60 * 5,
    });
};

export const useStudentReportCard = (studentId: string | null) => {
    const { institutionId } = useInstitution();
    return useQuery({
        queryKey: ["institution", institutionId, "report-card", studentId],
        queryFn: () =>
            ApiSDK.InstitutionService.getStudentReportCardApiV1InstitutionStudentsStudentIdReportCardGet(studentId!),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 2,
    });
};

export const useBulkReportCards = () => {
    return useMutation({
        mutationFn: async (body: {
            student_ids?: string[];
            classroom_id?: string;
            group_id?: string;
            format?: "json" | "pdf";
        }) => {
            const { format = "pdf", ...rest } = body;

            const headers = await getAuthHeaders();
            const response = await fetch(
                `${OpenAPI.BASE}/api/v1/institution/report-cards/bulk?format=${format}`,
                {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(rest),
                }
            );

            if (!response.ok) {
                const err = await response.json();
                throw err;
            }

            if (format === "pdf") {
                const blob = await response.blob();
                return { blob, total: null };
            }

            return response.json();
        },
    });
};


export const useScoreTrend = () => {
    const { institutionId } = useInstitution();
    return useQuery({
        queryKey: ["institution", institutionId, "analytics", "score-trend"],
        queryFn: () => ApiSDK.InstitutionService.
            getScoreTrendApiV1InstitutionAnalyticsOverviewScoreTrendGet(),
        staleTime: 1000 * 60 * 10,
    });
};

export const useClassroomPerformanceOverview = () => {
    const { institutionId } = useInstitution();
    return useQuery({
        queryKey: ["institution", institutionId, "analytics", "classroom-performance"],
        queryFn: () => ApiSDK.InstitutionService.
            getClassroomPerformanceOverviewApiV1InstitutionAnalyticsOverviewClassroomPerformanceGet(),
        staleTime: 1000 * 60 * 10,
    });
};



export const useInstitutionProfile = () => {
    const { institutionId } = useInstitution();
    return useQuery<InstitutionProfileResponse>({
        queryKey: ["institution", institutionId, "profile"],
        queryFn: () => ApiSDK.InstitutionService.getInstitutionProfileApiV1InstitutionProfileGet(),
        staleTime: 1000 * 60 * 5,
    });
};

export const useUpdateInstitutionProfile = () => {
    const { institutionId } = useInstitution();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<InstitutionUpdateRequest>) =>
            ApiSDK.InstitutionService.updateInstitutionProfileApiV1InstitutionProfilePatch(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["institution", institutionId, "profile"],
            });
        },
    });
};