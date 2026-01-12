import { useState } from 'react';
import {
  Button,
  Tabs,
  Tab,
  Card,
  CardBody,
  useDisclosure,
  Chip,
  Switch,
} from '@heroui/react';
import {
  Settings,
  CreditCard,
  Mail,
  Lock,
  Bell,
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

import { addToast } from '@heroui/react';
import { useDeleteSetting, usePlatformSettings, useUpdateSetting } from '../../hooks/usePlatformSettings';
import BallSpinner from '../../components/Spinner/BallSpinner';
import { CreateSettingModal } from './components/modals/CreateSettingModal';
import { EditSettingModal } from './components/modals/EditSettingModal';
import { DeleteConfirmModal } from '../Content/components/modals/DeleteConfirmModal';

const CATEGORY_ICONS: Record<string, any> = {
  payment: CreditCard,
  email: Mail,
  security: Lock,
  notifications: Bell,
  general: Settings,
  api: Globe,
};

export default function PlatformSettingsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('payment');
  const [selectedSetting, setSelectedSetting] = useState<any | null>(null);
  const [deleteSettingId, setDeleteSettingId] = useState<string>('');
  const [deleteSettingKey, setDeleteSettingKey] = useState<string>('');
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());

  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const { groupedSettings, isLoading } = usePlatformSettings();
  const updateSetting = useUpdateSetting();
  const deleteSetting = useDeleteSetting();

  const categories = Object.keys(groupedSettings);
  const currentSettings = groupedSettings[selectedCategory] || [];

  const toggleSecretVisibility = (settingId: string) => {
    const newVisible = new Set(visibleSecrets);
    if (newVisible.has(settingId)) {
      newVisible.delete(settingId);
    } else {
      newVisible.add(settingId);
    }
    setVisibleSecrets(newVisible);
  };

  const handleEdit = (setting: any) => {
    setSelectedSetting(setting);
    editModal.onOpen();
  };

  const handleDelete = (settingId: string, settingKey: string) => {
    setDeleteSettingId(settingId);
    setDeleteSettingKey(settingKey);
    deleteModal.onOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSetting.mutateAsync(deleteSettingId);
      addToast({ title: 'Success', description: 'Setting deleted', color: 'success' });
      deleteModal.onClose();
    } catch (error: any) {
      addToast({ title: 'Error', description: error.message, color: 'danger' });
    }
  };

  const handleToggleActive = async (setting: any) => {
    try {
      await updateSetting.mutateAsync({
        settingId: setting.id,
        data: { is_active: !setting.is_active },
      });
    } catch (error: any) {
      addToast({ title: 'Error', description: error.message, color: 'danger' });
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><BallSpinner /></div>;

  return (
    <>
      <section className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header - Stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-kidemia-primary/10 rounded-lg shrink-0">
              <Settings className="h-6 w-6 text-kidemia-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-normal text-gray-900">Platform Settings</h1>
              <p className="text-sm text-gray-600">Configuration management</p>
            </div>
          </div>
          <Button
            className="bg-kidemia-secondary text-white font-medium w-full sm:w-auto"
            startContent={<Plus className="h-4 w-4" />}
            onPress={createModal.onOpen}
          >
            Add Setting
          </Button>
        </div>

        {/* Tabs - Scrollable on small screens */}
        <div className="overflow-x-auto no-scrollbar border-b border-divider">
          <Tabs
            selectedKey={selectedCategory}
            onSelectionChange={(key) => setSelectedCategory(key as string)}
            variant="underlined"
            classNames={{
              tabList: 'gap-4 md:gap-8 rounded-none p-0',
              cursor: 'bg-kidemia-primary',
              tab: 'max-w-fit px-0 h-12',
              tabContent: 'group-data-[selected=true]:text-kidemia-primary font-semibold',
            }}
          >
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category] || Settings;
              return (
                <Tab
                  key={category}
                  title={
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Icon className="h-4 w-4" />
                      <span className="capitalize text-sm">{category}</span>
                      <Chip size="sm" variant="flat">{groupedSettings[category]?.length || 0}</Chip>
                    </div>
                  }
                />
              );
            })}
          </Tabs>
        </div>

        {/* Settings Cards */}
        <div className="grid gap-4">
          {currentSettings.length === 0 ? (
            <Card className="border-none shadow-sm"><CardBody className="py-12 text-center text-gray-500">No settings found.</CardBody></Card>
          ) : (
            currentSettings.map((setting) => {
              const isSecretVisible = visibleSecrets.has(setting.id);
              return (
                <Card key={setting.id} className="border-none shadow-sm">
                  <CardBody className="p-4 md:p-6">
                    <div className="flex flex-col gap-4">
                      {/* Top Row: Key & Badges & Actions */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-mono font-bold text-gray-900 break-all">{setting.key}</h3>
                            {setting.is_secret && <Chip size="sm" variant="flat" color="warning">Secret</Chip>}
                            <Chip size="sm" variant="flat" color={setting.is_active ? 'success' : 'default'}>
                              {setting.is_active ? 'Active' : 'Inactive'}
                            </Chip>
                          </div>
                          {setting.description && <p className="text-sm text-gray-500">{setting.description}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg ml-auto sm:ml-0">
                          <Switch
                            size="sm"
                            isSelected={setting.is_active}
                            onValueChange={() => handleToggleActive(setting)}
                            color="warning"
                          />
                          <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(setting)}><Edit className="h-4 w-4 text-gray-600" /></Button>
                          <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(setting.id, setting.key)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>

                      {/* Value Box */}
                      <div className="bg-gray-50 rounded-lg p-3 relative group">
                        <div className="flex items-center justify-between gap-4">
                          <code className="text-xs md:text-sm break-all text-kidemia-primary block">
                            {setting.is_secret && !isSecretVisible ? '••••••••••••••••' : (setting.value || 'Not set')}
                          </code>
                          {setting.is_secret && (
                            <Button isIconOnly size="sm" variant="light" onPress={() => toggleSecretVisibility(setting.id)}>
                              {isSecretVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* Modals */}
      <CreateSettingModal isOpen={createModal.isOpen} onClose={createModal.onClose} defaultCategory={selectedCategory} />
      <EditSettingModal isOpen={editModal.isOpen} onClose={editModal.onClose} setting={selectedSetting} />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        title="Delete Setting"
        message={`Are you sure you want to delete the setting "${deleteSettingKey}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        isLoading={deleteSetting.isPending}
      />
    </>
  );
}