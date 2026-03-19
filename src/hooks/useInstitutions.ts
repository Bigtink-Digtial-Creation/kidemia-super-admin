import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import type {
    Body_bulk_onboard_institutions_api_v1_admin_institutions_bulk_upload_post,
    InstitutionOnboardRequest, InstitutionStatusUpdate
} from '../sdk/generated';
import type { TierKey } from '../pages/Institution/utils';

export const useInstitutions = () => {
    const [filters, setFilters] = useState({
        search: '',
        tier: '',
        is_public: '' as '' | boolean,
    });

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
    });

    const query = useQuery({
        queryKey: [QueryKeys.institutions, filters, pagination],
        queryFn: async () => {
            const skip = (pagination.page - 1) * pagination.pageSize;

            return ApiSDK.AdminInstitutionControlService.listInstitutionsApiV1AdminInstitutionsListGet(
                skip || undefined,
                pagination.pageSize || undefined,
                filters.search || undefined,
                filters.tier || undefined,
                filters.is_public === '' ? undefined : filters.is_public
            );
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });

    return {
        institutions: query.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        filters,
        setFilters,
        pagination,
        setPagination,
    };
};

export const useCreateInstitution = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: InstitutionOnboardRequest) =>
            ApiSDK.AdminInstitutionControlService.onboardInstitutionApiV1AdminInstitutionsPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.institutions] });
        },

    });
};

export const useToggleInstitutionAccess = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            institutionId,
            data,
        }: {
            institutionId: string;
            data: InstitutionStatusUpdate;
        }) =>
            ApiSDK.AdminInstitutionControlService.toggleInstitutionAccessApiV1AdminInstitutionsInstitutionIdAccessPatch(institutionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.institutions] });
        },
    });
};

export const useBulkOnboardInstitutions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: Body_bulk_onboard_institutions_api_v1_admin_institutions_bulk_upload_post) =>
            ApiSDK.AdminInstitutionControlService.bulkOnboardInstitutionsApiV1AdminInstitutionsBulkUploadPost(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.institutions] });
        },
    });
};

// utils/institutionTemplate.ts
export function downloadInstitutionTemplate() {
    const csv = [
        "name,code,email,phone,city,state,country,tier,max_students,owner_email,owner_first_name,owner_last_name,owner_phone",
        "Greenfield Academy,GFA-LG,info@greenfield.edu.ng,+2348001234567,Lagos,Lagos,Nigeria,premium,500,samuel@greenfield.edu.ng,Samuel,Adeyemi,+2348001234568",
        "Sunrise Secondary School,SSS-KN,contact@sunrise.edu.ng,,Kano,Kano,Nigeria,basic,,principal@sunrise.edu.ng,Amina,Yusuf,",
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "institutions-template.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// hooks/useInstitutions.ts

export const useVerifyInstitution = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ institutionId, data }: { institutionId: string, data: InstitutionStatusUpdate }) =>
            ApiSDK.AdminInstitutionControlService.toggleInstitutionAccessApiV1AdminInstitutionsInstitutionIdAccessPatch(institutionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.institutions] });
        },
    });
};

export const useChangeInstitutionTier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ institutionId, tier }: { institutionId: string; tier: TierKey }) =>
            ApiSDK.AdminInstitutionControlService.updateInstitutionTierApiV1AdminInstitutionsInstitutionIdTierPatch(institutionId, { tier }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.institutions] });
        },
    });
};