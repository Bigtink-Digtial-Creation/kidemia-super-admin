import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "@heroui/react";
import { UserPlus, Mail, User, Lock, Phone, Calendar } from "lucide-react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import type { UserType } from "../../../../sdk/generated";

// Validation schema
const createUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain uppercase letter")
        .regex(/[a-z]/, "Password must contain lowercase letter")
        .regex(/[0-9]/, "Password must contain number"),
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    middle_name: z.string().optional(),
    user_type: z.enum([
        "student",
        "guardian",
        "institution_admin",
        "platform_admin",
    ]),
    phone_number: z.string().optional(),
    date_of_birth: z.string().optional(),
    username: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onCreateUser: (data: CreateUserFormData) => Promise<void>;
    isCreating?: boolean;
}

const userTypeOptions = [
    { value: "student", label: "Student" },
    { value: "guardian", label: "Guardian" },
    { value: "institution_admin", label: "Institution Admin" },
    { value: "platform_admin", label: "Platform Admin" },
];

export function CreateUserModal({
    isOpen,
    onClose,
    onSuccess,
    onCreateUser,
    isCreating = false,
}: CreateUserModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            user_type: "student",
        },
    });

    const handleClose = () => {
        reset();
        setShowPassword(false);
        onClose();
    };

    const onSubmit = async (data: CreateUserFormData) => {
        setIsSubmitting(true);
        try {
            // Map the Zod data to the full RegisterRequest payload
            const payload = {
                ...data,
                // Add missing fields the backend expects
                category: null,
                guardian_email: null,
                school_name: null,
                admin_email: null,
                // Ensure "optional" fields are explicitly null if empty
                middle_name: data.middle_name || null,
                phone_number: data.phone_number || null,
                date_of_birth: data.date_of_birth || null,
                username: data.username || null,
            };

            await onCreateUser(payload as any);

            addToast({
                title: "User created successfully",
                color: "success",
            });
            handleClose();
            onSuccess();
        } catch (error: any) {
            addToast({
                title: "Failed to create user",
                description: error?.body?.detail || "An error occurred",
                color: "danger",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    const isLoading = isCreating || isSubmitting;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh]",
            }}
        >
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className="flex items-center gap-3 border-b pb-4">
                        <div className="p-2 bg-kidemia-primary/10 rounded-lg">
                            <UserPlus className="h-5 w-5 text-kidemia-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Create New User
                            </h3>
                            <p className="text-sm text-slate-500 font-normal">
                                Add a new user to the platform
                            </p>
                        </div>
                    </ModalHeader>

                    <ModalBody className="py-6 space-y-6">
                        {/* User Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                User Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                                placeholder="Select user type"
                                selectedKeys={[watch("user_type")]}
                                onChange={(e) =>
                                    setValue("user_type", e.target.value as UserType)
                                }
                                isInvalid={!!errors.user_type}
                                errorMessage={errors.user_type?.message}
                                isDisabled={isLoading}
                                classNames={{
                                    trigger: "border-slate-200",
                                }}
                            >
                                {userTypeOptions.map((option) => (
                                    <SelectItem key={option.value} textValue={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="John"
                                    startContent={<User className="h-4 w-4 text-slate-400" />}
                                    {...register("first_name")}
                                    isInvalid={!!errors.first_name}
                                    errorMessage={errors.first_name?.message}
                                    isDisabled={isLoading}
                                    classNames={{
                                        inputWrapper: "border-slate-200",
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Doe"
                                    startContent={<User className="h-4 w-4 text-slate-400" />}
                                    {...register("last_name")}
                                    isInvalid={!!errors.last_name}
                                    errorMessage={errors.last_name?.message}
                                    isDisabled={isLoading}
                                    classNames={{
                                        inputWrapper: "border-slate-200",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Middle Name & Username */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Middle Name
                                </label>
                                <Input
                                    placeholder="Optional"
                                    startContent={<User className="h-4 w-4 text-slate-400" />}
                                    {...register("middle_name")}
                                    isDisabled={isLoading}
                                    classNames={{
                                        inputWrapper: "border-slate-200",
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Username
                                </label>
                                <Input
                                    placeholder="Optional"
                                    startContent={<User className="h-4 w-4 text-slate-400" />}
                                    {...register("username")}
                                    isDisabled={isLoading}
                                    classNames={{
                                        inputWrapper: "border-slate-200",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                startContent={<Mail className="h-4 w-4 text-slate-400" />}
                                {...register("email")}
                                isInvalid={!!errors.email}
                                errorMessage={errors.email?.message}
                                isDisabled={isLoading}
                                classNames={{
                                    inputWrapper: "border-slate-200",
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 8 characters, 1 uppercase, 1 number"
                                startContent={<Lock className="h-4 w-4 text-slate-400" />}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-4 w-4 text-slate-400" />
                                        ) : (
                                            <FaRegEye className="h-4 w-4 text-slate-400" />
                                        )}
                                    </button>
                                }
                                {...register("password")}
                                isInvalid={!!errors.password}
                                errorMessage={errors.password?.message}
                                isDisabled={isLoading}
                                classNames={{
                                    inputWrapper: "border-slate-200",
                                }}
                            />
                        </div>

                        {/* Phone & Date of Birth */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Phone Number
                                </label>
                                <Input
                                    type="tel"
                                    placeholder="+234 XXX XXX XXXX"
                                    startContent={<Phone className="h-4 w-4 text-slate-400" />}
                                    {...register("phone_number")}
                                    isDisabled={isLoading}
                                    classNames={{
                                        inputWrapper: "border-slate-200",
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Date of Birth
                                </label>
                                <Input
                                    type="date"
                                    startContent={<Calendar className="h-4 w-4 text-slate-400" />}
                                    {...register("date_of_birth")}
                                    isDisabled={isLoading}
                                    classNames={{
                                        inputWrapper: "border-slate-200",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> A verification email will be sent to the
                                user's email address. They must verify their email before
                                accessing the platform.
                            </p>
                        </div>
                    </ModalBody>

                    <ModalFooter className="border-t pt-4">
                        <Button
                            variant="flat"
                            onPress={handleClose}
                            isDisabled={isLoading}
                            className="font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-kidemia-primary text-white font-semibold"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        >
                            Create User
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}