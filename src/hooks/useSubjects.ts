import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo, useState } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import type { QuestionListResponse, SubjectCreate, SubjectListResponse, SubjectResponse, TopicCreate, TopicListResponse } from '../sdk/generated';

// Atoms for state management
export const subjectFiltersAtom = atomWithStorage('subject-filters', {
    search: '',
    category: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
});

export const subjectPaginationAtom = atomWithStorage('subject-pagination', {
    page: 1,
    pageSize: 10,
});



export const useSubjects = () => {
    const [filters, setFilters] = useState({
        search: "",
        category: "",
    });

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });

    const query = useQuery<SubjectListResponse>({
        queryKey: [
            QueryKeys.subjects,
            filters.search,
            filters.category,
            pagination.page,
            pagination.pageSize,
        ],
        queryFn: async () => {
            const skip = (pagination.page - 1) * pagination.pageSize;

            if (filters.search.trim()) {
                return ApiSDK.SubjectsService.searchSubjectsApiV1SubjectsSearchGet(
                    filters.search,
                    skip,
                    pagination.pageSize,
                );
            }

            return ApiSDK.SubjectsService.getSubjectsApiV1SubjectsGet(
                skip,
                pagination.pageSize,
            );
        },

        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });

    return {
        subjects: query.data?.items ?? [],
        totalCount: query.data?.total ?? 0,
        page: query.data?.page ?? pagination.page,
        pageSize: query.data?.page_size ?? pagination.pageSize,
        totalPages: Math.ceil(
            (query.data?.total ?? 0) / pagination.pageSize
        ),


        isLoading: query.isLoading,
        isFetching: query.isFetching,

        filters,
        setFilters,
        pagination,
        setPagination,
    };
};


// Subjects Hook
// export const useSubjects = () => {
//     const [filters, setFilters] = useAtom(subjectFiltersAtom);
//     const [pagination, setPagination] = useAtom(subjectPaginationAtom);

//     const {
//         data: subjectsResponse,
//         isLoading,
//         error,
//         refetch,
//     } = useQuery<SubjectListResponse>({
//         queryKey: [QueryKeys.subjects, filters, pagination],
//         queryFn: async () => {
//             return ApiSDK.SubjectsService.getSubjectsApiV1SubjectsGet(
//                 (pagination.page - 1) * pagination.pageSize,
//                 pagination.pageSize,
//             );
//         },
//         staleTime: 1000 * 60 * 5,
//     });
//     // ({
//     //         skip: (pagination.page - 1) * pagination.pageSize,
//     //         limit: pagination.pageSize,
//     //         search: filters.search || undefined,
//     //         category: filters.category !== 'all' ? filters.category : undefined,
//     //       });
//     const subjects = useMemo(() => {
//         return subjectsResponse?.items || [];
//     }, [subjectsResponse]);


//     const filteredSubjects = useMemo(() => {
//         let filtered = [...subjects];

//         if (filters.search) {
//             const search = filters.search.toLowerCase();
//             filtered = filtered.filter(
//                 (subject) =>
//                     subject.name?.toLowerCase().includes(search) ||
//                     subject.description?.toLowerCase().includes(search)
//             );
//         }

//         // if (filters.category !== 'all') {
//         //   filtered = filtered.filter(
//         //     (subject) => subject.category === filters.category
//         //   );
//         // }

//         return filtered;
//     }, [subjects, filters]);

//     const totalCount = filteredSubjects.length;
//     const totalPages = Math.ceil(totalCount / pagination.pageSize);

//     const paginatedSubjects = useMemo(() => {
//         const start = (pagination.page - 1) * pagination.pageSize;
//         const end = start + pagination.pageSize;
//         return filteredSubjects.slice(start, end);
//     }, [filteredSubjects, pagination]);

//     return {
//         subjects: paginatedSubjects,
//         allSubjects: subjects,
//         totalCount,
//         totalPages,
//         isLoading,
//         error,
//         filters,
//         setFilters,
//         pagination,
//         setPagination,
//         refetch,
//     };
// };

// Single Subject Hook
export const useSubject = (subjectId: string | undefined) => {
    const {
        data: subjectResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<SubjectResponse>({
        queryKey: [QueryKeys.singleSubject, subjectId],
        queryFn: async () => {
            if (!subjectId) throw new Error('Subject ID required');
            return ApiSDK.SubjectsService.getSubjectApiV1SubjectsSubjectIdGet(
                subjectId
            );
        },
        enabled: !!subjectId,
        staleTime: 1000 * 60 * 5,
    });

    const subject = useMemo(() => {
        return subjectResponse ?? null;
    }, [subjectResponse]);

    return {
        subject,
        isLoading,
        error,
        refetch,
    };
};

// Create Subject Hook
export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SubjectCreate) => {
            return ApiSDK.SubjectsService.createSubjectApiV1SubjectsPost(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subjects] });
        },
    });
};

// Update Subject Hook
export const useUpdateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            subjectId,
            data,
        }: {
            subjectId: string;
            data: any;
        }) => {
            return ApiSDK.SubjectsService.updateSubjectApiV1SubjectsSubjectIdPut(
                subjectId,
                data
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subjects] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.singleSubject, variables.subjectId],
            });
        },
    });
};

// Delete Subject Hook
export const useDeleteSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (subjectId: string) => {
            return ApiSDK.SubjectsService.deleteSubjectApiV1SubjectsSubjectIdDelete(
                subjectId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subjects] });
        },
    });
};

// Topics Hook (for a specific subject)
export const useTopics = (subjectId: string | undefined) => {
    const {
        data: topicsResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<TopicListResponse>({
        queryKey: [QueryKeys.subjectTopics, subjectId],
        queryFn: async () => {
            if (!subjectId) throw new Error('Subject ID required');
            return ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(
                subjectId,
            );
        },
        enabled: !!subjectId,
        staleTime: 1000 * 60 * 5,
    });

    const topics = useMemo(() => {
        return topicsResponse?.items || [];
    }, [topicsResponse]);

    return {
        topics,
        isLoading,
        error,
        refetch,
    };
};

// Create Topic Hook
export const useCreateTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TopicCreate) => {
            return ApiSDK.SubjectTopicsService.createTopicApiV1TopicsPost(data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subjectTopics] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.singleSubject, variables.subject_id],
            });
        },
    });
};

// Delete Topic Hook
export const useDeleteTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (topicId: string) => {
            return ApiSDK.SubjectTopicsService.deleteTopicApiV1TopicsTopicIdDelete(topicId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subjectTopics] });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.subjects] });
        },
    });
};

// Questions Hook (for a specific topic)
export const useQuestions = (topicId: string | undefined) => {
    const {
        data: questionsResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<QuestionListResponse>({
        queryKey: [QueryKeys.questions, topicId],
        queryFn: async () => {
            if (!topicId) throw new Error('Topic ID required');
            return ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(
                undefined,
                topicId,
            );
        },
        enabled: !!topicId,
        staleTime: 1000 * 60 * 5,
    });

    const questions = useMemo(() => {
        return questionsResponse?.items || [];
    }, [questionsResponse]);

    return {
        questions,
        isLoading,
        error,
        refetch,
    };
};

// Delete Question Hook
export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (questionId: string) => {
            return ApiSDK.TopicQuestionsService.deleteQuestionApiV1QuestionsQuestionIdDelete(
                questionId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.questions] });
        },
    });
};