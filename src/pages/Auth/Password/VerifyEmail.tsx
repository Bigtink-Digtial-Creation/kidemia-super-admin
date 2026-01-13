import { useNavigate, useSearchParams } from "react-router";
import { addToast, Button } from "@heroui/react";
import { AuthRoutes, SidebarRoutes } from "../../../routes";
import { useMutation } from "@tanstack/react-query";
import type { VerifyEmailRequest } from "../../../sdk/generated";
import { ApiSDK } from "../../../sdk";
import { apiErrorParser } from "../../../utils/errorParser";
import { useEffect, useState, useRef } from "react";
import { MdCheckCircle, MdError } from "react-icons/md";
import { verifyEmailAtom } from "../../../store/auth.atom";
import { useAtomValue, useSetAtom } from "jotai";
import { loggedinUserAtom } from "../../../store/user.atom";

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const verifyEmail = useSetAtom(verifyEmailAtom);
    const loggedInUser = useAtomValue(loggedinUserAtom);
    const hasAttemptedVerification = useRef(false);

    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
        } else {
            addToast({
                title: "Invalid Verification Link",
                description: "No token found in the URL",
                color: "danger",
            });
            navigate(AuthRoutes.login);
        }
    }, [searchParams, navigate]);

    const verifyEmailMutation = useMutation({
        mutationFn: (formData: VerifyEmailRequest) =>
            ApiSDK.AuthenticationService.verifyEmailApiV1AuthVerifyEmailPost(
                formData
            ),
        onSuccess(data) {
            addToast({
                title: "Email verification completed!",
                description: data?.message || "Your email has been verified successfully.",
                color: "success",
            });

            // Check if user is logged in at the time of success
            // Note: We need to get the fresh value, not the closure value
            if (loggedInUser?.user) {
                verifyEmail();
                setTimeout(() => {
                    navigate(SidebarRoutes.dashboard);
                }, 1500);
            }
            // If not logged in, user will click "Continue to Login" button
            // Don't auto-navigate to login - let them see the success message
        },
        onError(error) {
            const parsedError = apiErrorParser(error);
            addToast({
                title: "Verification Failed",
                description: parsedError.message,
                color: "danger",
            });
        },
    });

    const resendVerificationMutation = useMutation({
        mutationFn: () =>
            ApiSDK.AuthenticationService.resendVerificationApiV1AuthResendVerificationPost(),
        onSuccess(data) {
            addToast({
                title: "Email Sent!",
                description: data?.message || "Check your inbox for a new verification link",
                color: "success",
            });
        },
        onError(error) {
            addToast({
                title: "Failed to Send Email",
                description: error?.message || "Could not resend verification email. Please try again later.",
                color: "danger",
            });
        },
    });

    useEffect(() => {
        if (token && !hasAttemptedVerification.current) {
            hasAttemptedVerification.current = true;
            verifyEmailMutation.mutate({ token });
        }
    }, [token]);

    const handleContinue = () => {
        navigate(AuthRoutes.login);
    };

    const handleResend = () => {
        resendVerificationMutation.mutate();
    };

    return (
        <div className="py-4 w-full md:w-2xl space-y-6 md:px-12">
            <div className="space-y-6">
                {verifyEmailMutation.isPending && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-kidemia-secondary"></div>
                        <h2 className="text-2xl text-kidemia-black font-semibold text-center">
                            Verifying Your Email...
                        </h2>
                        <p className="text-lg text-kidemia-black2 text-center font-medium">
                            Please wait while we verify your email address
                        </p>
                    </div>
                )}

                {verifyEmailMutation.isSuccess && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="rounded-full bg-green-100 p-4">
                            <MdCheckCircle className="text-green-600 text-6xl" />
                        </div>
                        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
                            Email Verified!
                        </h2>
                        <p className="text-lg text-kidemia-black2 text-center font-medium">
                            Your email has been successfully verified.{" "}
                            {loggedInUser?.user
                                ? "Redirecting to your dashboard..."
                                : "You can now log in to your account."}
                        </p>
                        {!loggedInUser?.user && (
                            <div className="py-4 w-full">
                                <Button
                                    onPress={handleContinue}
                                    variant="solid"
                                    size="lg"
                                    className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                                    radius="sm"
                                >
                                    Continue to Login
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {verifyEmailMutation.isError && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="rounded-full bg-red-100 p-4">
                            <MdError className="text-red-600 text-6xl" />
                        </div>
                        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
                            Verification Failed
                        </h2>
                        <p className="text-lg text-kidemia-black2 text-center font-medium">
                            {verifyEmailMutation.error?.message ||
                                "The verification link is invalid or has expired."}
                        </p>

                        {resendVerificationMutation.isSuccess && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full">
                                <p className="text-green-800 text-center font-medium">
                                    ✓ New verification email sent! Check your inbox.
                                </p>
                            </div>
                        )}

                        <div className="py-4 w-full space-y-2">
                            <Button
                                onPress={handleResend}
                                variant="solid"
                                size="lg"
                                className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                                radius="sm"
                                isDisabled={resendVerificationMutation.isPending}
                                isLoading={resendVerificationMutation.isPending}
                            >
                                Resend Verification Email
                            </Button>
                            <Button
                                onPress={() => navigate(AuthRoutes.login)}
                                variant="bordered"
                                size="lg"
                                className="border-kidemia-secondary text-kidemia-secondary font-semibold w-full"
                                radius="sm"
                            >
                                Back to Login
                            </Button>
                        </div>

                        <p className="text-sm text-kidemia-black2 text-center">
                            Check your spam folder if you don't see the email
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}