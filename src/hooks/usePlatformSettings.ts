import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import type { PlatformSettingCreate, PlatformSettingPublic, PlatformSettingUpdate } from '../sdk/generated';

// Atoms
export const settingsFiltersAtom = atomWithStorage('settings-filters', {
    category: 'all',
});

// Platform Settings Hook
export const usePlatformSettings = (category?: string) => {
    const {
        data: settingsResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<PlatformSettingPublic[]>({
        queryKey: [QueryKeys.platformSettings, category],
        queryFn: async () => {
            return ApiSDK.PlatformSettingsService.getSettingsApiV1SettingsSettingsGet(
                category !== 'all' ? category : undefined,
            );
        },
        staleTime: 1000 * 60 * 5,
    });

    const settings = useMemo(() => {
        return settingsResponse || [];
    }, [settingsResponse]);

    // Group settings by category
    const groupedSettings = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        settings.forEach((setting) => {
            if (!grouped[setting.category]) {
                grouped[setting.category] = [];
            }
            grouped[setting.category].push(setting);
        });
        return grouped;
    }, [settings]);

    return {
        settings,
        groupedSettings,
        isLoading,
        error,
        refetch,
    };
};

// Single Setting Hook
export const useSetting = (settingId: string | undefined) => {
    const {
        data: settingResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<PlatformSettingPublic>({
        queryKey: [QueryKeys.singleSetting, settingId],
        queryFn: async () => {
            if (!settingId) throw new Error('Setting ID required');
            return ApiSDK.PlatformSettingsService.getSettingApiV1SettingsSettingsSettingIdGet(
                settingId
            );
        },
        enabled: !!settingId,
        staleTime: 1000 * 60 * 5,
    });

    const setting = useMemo(() => {
        return settingResponse ?? null;
    }, [settingResponse]);

    return {
        setting,
        isLoading,
        error,
        refetch,
    };
};

// Get Setting by Key Hook
export const useSettingByKey = (key: string | undefined) => {
    const {
        data: settingResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<PlatformSettingPublic>({
        queryKey: [QueryKeys.settingByKey, key],
        queryFn: async () => {
            if (!key) throw new Error('Setting key required');
            return ApiSDK.PlatformSettingsService.getSettingByKeyApiV1SettingsSettingsKeyKeyGet(
                key
            );
        },
        enabled: !!key,
        staleTime: 1000 * 60 * 5,
    });

    const setting = useMemo(() => {
        return settingResponse ?? null;
    }, [settingResponse]);

    return {
        setting,
        isLoading,
        error,
        refetch,
    };
};

// Create Setting Hook
export const useCreateSetting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PlatformSettingCreate) => {
            return ApiSDK.PlatformSettingsService.createSettingApiV1SettingsSettingsPost(
                data
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.platformSettings] });
        },
    });
};

// Update Setting Hook
export const useUpdateSetting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ settingId, data }: { settingId: string; data: PlatformSettingUpdate }) => {
            return ApiSDK.PlatformSettingsService.updateSettingApiV1SettingsSettingsSettingIdPut(
                settingId,
                data
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.platformSettings] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.singleSetting, variables.settingId],
            });
        },
    });
};

// Delete Setting Hook
export const useDeleteSetting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settingId: string) => {
            return ApiSDK.PlatformSettingsService.deleteSettingApiV1SettingsSettingsSettingIdDelete(
                settingId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.platformSettings] });
        },
    });
};

// Get Categories Hook
export const useSettingCategories = () => {
    const {
        data: categoriesResponse,
        isLoading,
        error,
    } = useQuery({
        queryKey: [QueryKeys.settingCategories],
        queryFn: async () => {
            return ApiSDK.PlatformSettingsService.getCategoriesApiV1SettingsSettingsCategoriesListGet();
        },
        staleTime: 1000 * 60 * 10,
    });

    const categories = useMemo(() => {
        return categoriesResponse?.data || [];
    }, [categoriesResponse]);

    return {
        categories,
        isLoading,
        error,
    };
};