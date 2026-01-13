import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    addToast,
} from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, Phone, Calendar, Info } from 'lucide-react';
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

// Validation schema
const createUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    middle_name: z.string().optional(),
    user_type: z.string().min(1, "User type is required"),
    phone_number: z.string().optional(),
    date_of_birth: z.string().optional(),
    username: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onCreateUser: (data: any) => Promise<void>;
    isCreating?: boolean;
}

const userTypeOptions = [
    { value: "student", label: "Student" },
    { value: "guardian", label: "Guardian" },
    { value: "institution_admin", label: "Institution Admin" },
    { value: "platform_admin", label: "Platform Admin" },
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onCreateUser,
    isCreating = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            user_type: "student",
        }
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: CreateUserFormData) => {
        try {
            await onCreateUser(data);
            addToast({ title: "Success", color: "success" });
            handleClose();
            onSuccess();
        } catch (error: any) {
            addToast({ title: "Error", description: error?.message, color: "danger" });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            placement="center"
            scrollBehavior="inside"
            classNames={{
                base: 'bg-kidemia-white max-h-[90vh] mx-2', // Added margin for mobile
                backdrop: 'bg-black/50',
            }}
        >
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className="flex flex-col gap-1 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <UserPlus className="text-kidemia-secondary" size={20} />
                            <span className="text-xl font-bold">Create New User</span>
                        </div>
                    </ModalHeader>

                    <ModalBody className="py-6 space-y-5">
                        {/* Role Selection - Full Width */}
                        <Select
                            label="User Type"
                            labelPlacement="outside"
                            placeholder="Select user type"
                            variant="flat"
                            selectedKeys={[watch("user_type")]}
                            onChange={(e) => setValue("user_type", e.target.value)}
                            classNames={{ trigger: "bg-kidemia-biege/30" }}
                        >
                            {userTypeOptions.map((opt) => (
                                <SelectItem key={opt.value} textValue={opt.label}>{opt.label}</SelectItem>
                            ))}
                        </Select>

                        {/* Name Fields - Stack on mobile, side-by-side on MD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                {...register("first_name")}
                                label="First Name"
                                labelPlacement="outside"
                                placeholder="John"
                                variant="flat"
                                isInvalid={!!errors.first_name}
                                errorMessage={errors.first_name?.message}
                                classNames={{ inputWrapper: 'bg-kidemia-biege/30' }}
                            />
                            <Input
                                {...register("last_name")}
                                label="Last Name"
                                labelPlacement="outside"
                                placeholder="Doe"
                                variant="flat"
                                isInvalid={!!errors.last_name}
                                errorMessage={errors.last_name?.message}
                                classNames={{ inputWrapper: 'bg-kidemia-biege/30' }}
                            />
                        </div>

                        {/* Credentials - Stack on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                {...register("email")}
                                type="email"
                                label="Email"
                                labelPlacement="outside"
                                placeholder="name@example.com"
                                variant="flat"
                                startContent={<Mail size={16} className="text-gray-400" />}
                                isInvalid={!!errors.email}
                                errorMessage={errors.email?.message}
                                classNames={{ inputWrapper: 'bg-kidemia-biege/30' }}
                            />
                            <Input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                labelPlacement="outside"
                                placeholder="••••••••"
                                variant="flat"
                                startContent={<Lock size={16} className="text-gray-400" />}
                                endContent={
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaRegEye className="text-gray-400" />}
                                    </button>
                                }
                                isInvalid={!!errors.password}
                                errorMessage={errors.password?.message}
                                classNames={{ inputWrapper: 'bg-kidemia-biege/30' }}
                            />
                        </div>

                        {/* Additional Info - Stack on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                {...register("phone_number")}
                                label="Phone"
                                labelPlacement="outside"
                                placeholder="+234..."
                                variant="flat"
                                startContent={<Phone size={16} className="text-gray-400" />}
                                classNames={{ inputWrapper: 'bg-kidemia-biege/30' }}
                            />
                            <Input
                                {...register("date_of_birth")}
                                type="date"
                                label="Date of Birth"
                                labelPlacement="outside"
                                variant="flat"
                                startContent={<Calendar size={16} className="text-gray-400" />}
                                classNames={{ inputWrapper: 'bg-kidemia-biege/30' }}
                            />
                        </div>

                        <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <Info size={18} className="text-blue-500 shrink-0" />
                            <p className="text-xs text-blue-700">The user will receive an email to verify their account after creation.</p>
                        </div>
                    </ModalBody>

                    <ModalFooter className="border-t border-gray-100">
                        <div className="flex w-full flex-col sm:flex-row gap-3">
                            <Button
                                variant="flat"
                                className="flex-1 bg-kidemia-biege/50 text-kidemia-secondary font-bold"
                                onPress={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isCreating}
                                className="flex-1 bg-kidemia-secondary text-white font-bold"
                            >
                                Create User
                            </Button>
                        </div>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};