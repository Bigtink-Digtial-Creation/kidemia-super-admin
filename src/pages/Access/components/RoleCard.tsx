// components/access/RoleCard.tsx
import React from 'react';
import { Card, CardBody, Chip, Button } from '@heroui/react';
import { Shield, Edit, Trash2, Lock, Key } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { RoleResponse } from '../../../sdk/generated';
import { SidebarRoutes } from '../../../routes';

interface RoleCardProps {
    role: RoleResponse;
    onEdit: (role: RoleResponse) => void;
    onDelete: (roleId: string, roleName: string) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const getRoleTypeColor = (isSystem: boolean) => {
        return isSystem ? 'default' : 'warning';
    };

    return (
        <Card
            isPressable
            isHoverable
            className="border border-gray-200 hover:border-kidemia-primary/30 transition-all"
            onPress={() => navigate(SidebarRoutes.singleRole.replace(":id", role.id))}
        >
            <CardBody className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-kidemia-primary/10 rounded-lg">
                            <Shield className="h-5 w-5 text-kidemia-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-kidemia-primary mb-1 capitalize truncate">
                                {role.display_name || role.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {role.description || 'No description provided'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Chip
                        size="sm"
                        variant="flat"
                        color={getRoleTypeColor(role.is_system)}
                        startContent={<Lock className="h-3 w-3" />}
                    >
                        {role.is_system ? 'System' : 'Custom'}
                    </Chip>
                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<Key className="h-3 w-3" />}
                    >
                        {role.permissions?.length || 0} Permissions
                    </Chip>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                        size="sm"
                        variant="flat"
                        color="warning"
                        startContent={<Edit className="h-4 w-4" />}
                        onPress={() => {
                            onEdit(role);
                        }}
                    >
                        Edit
                    </Button>
                    {!role.is_system && (
                        <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            startContent={<Trash2 className="h-4 w-4" />}
                            onPress={() => {
                                onDelete(role.id, role.display_name || role.name);
                            }}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

