import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { addToast, Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ResetPasswordSchema } from "../../../schema/auth.schema";
import { AuthRoutes } from "../../../routes";
import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordRequest } from "../../../sdk/generated";
import { ApiSDK } from "../../../sdk";
import { apiErrorParser } from "../../../utils/errorParser";
import { useEffect, useState } from "react";


export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    // Get token from URL query params
    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setValue("token", token);
        } else {
            addToast({
                title: "Invalid Reset Link",
                description: "No token found in the URL",
                color: "danger",
            });
            navigate(AuthRoutes.forgotPassword);
        }
    }, [searchParams, setValue, navigate]);

    const resetPasswordMutation = useMutation({
        mutationFn: (formData: ResetPasswordRequest) =>
            ApiSDK.AuthenticationService.resetPasswordApiV1AuthResetPasswordPost(
                formData
            ),
        onSuccess(data) {
            addToast({
                title: "Success!",
                description: data?.message,
                color: "success",
            });
            navigate(AuthRoutes.login);
        },
        onError(error) {
            const parsedError = apiErrorParser(error);
            addToast({
                title: "Reset Failed",
                description: parsedError.message,
                color: "danger",
            });
        },
    });

    const onSubmit = (data: ResetPasswordSchema) => {
        resetPasswordMutation.mutate({
            token: data.token,
            new_password: data.new_password,
        });
    };

    return (
        <div className="py-4 w-full md:w-2xl space-y-6 md:px-12">
            <div className="space-y-3">
                <h2 className="text-3xl text-kidemia-black font-semibold text-center">
                    Reset Password
                </h2>
                <p className="text-lg text-kidemia-black2 text-center font-medium">
                    Enter your new password below
                </p>
            </div>

            <Form className="py-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("token")} />

                <div className="w-full">
                    <Input
                        variant="flat"
                        size="lg"
                        radius="sm"
                        startContent={
                            <RiLockPasswordLine className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                        }
                        endContent={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="focus:outline-none"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="text-kidemia-black2 text-xl" />
                                ) : (
                                    <AiOutlineEye className="text-kidemia-black2 text-xl" />
                                )}
                            </button>
                        }
                        placeholder="New password"
                        type={showPassword ? "text" : "password"}
                        {...register("new_password")}
                        isInvalid={!!errors?.new_password?.message}
                        errorMessage={errors?.new_password?.message}
                        isDisabled={resetPasswordMutation.isPending}
                    />
                </div>

                <div className="w-full">
                    <Input
                        variant="flat"
                        size="lg"
                        radius="sm"
                        startContent={
                            <RiLockPasswordLine className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                        }
                        endContent={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <AiOutlineEyeInvisible className="text-kidemia-black2 text-xl" />
                                ) : (
                                    <AiOutlineEye className="text-kidemia-black2 text-xl" />
                                )}
                            </button>
                        }
                        placeholder="Confirm new password"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirm_password")}
                        isInvalid={!!errors?.confirm_password?.message}
                        errorMessage={errors?.confirm_password?.message}
                        isDisabled={resetPasswordMutation.isPending}
                    />
                </div>

                <div className="py-4 w-full">
                    <Button
                        type="submit"
                        variant="solid"
                        size="lg"
                        className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                        radius="sm"
                        isDisabled={resetPasswordMutation.isPending}
                        isLoading={resetPasswordMutation.isPending}
                    >
                        Reset Password
                    </Button>
                </div>
            </Form>

            <div className="w-full">
                <p className="text-base text-kidemia-black font-medium text-center">
                    Remember your password?{" "}
                    <Link
                        to={AuthRoutes.login}
                        className="text-kidemia-secondary font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
