import { useNavigate } from "react-router";
import { addToast, Button } from "@heroui/react";
import { AuthRoutes, SidebarRoutes } from "../../../routes";
import { useMutation } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { apiErrorParser } from "../../../utils/errorParser";
import { MdOutlineEmail } from "react-icons/md";
import { useAtom, useAtomValue } from "jotai";
import {
    loggedinUserAtom,
    storedAuthTokenAtom,
    userRoleAtom,
} from "../../../store/user.atom";

export default function EmailVerificationRequiredPage() {
    const navigate = useNavigate();
    const loggedInUser = useAtomValue(loggedinUserAtom);
    const [, setAuthToken] = useAtom(storedAuthTokenAtom);
    const [, setLoggedInUser] = useAtom(loggedinUserAtom);
    const [, setUserRole] = useAtom(userRoleAtom);

    const resendVerificationMutation = useMutation({
        mutationFn: () =>
            ApiSDK.AuthenticationService
                .resendVerificationApiV1AuthResendVerificationPost(),
        onSuccess(data) {
            addToast({
                title: "Email sent",
                description:
                    data?.message ||
                    "Check your inbox for the verification link.",
                color: "success",
            });
        },
        onError(error) {
            const parsedError = apiErrorParser(error);
            addToast({
                title: "Couldn’t send email",
                description: parsedError.message,
                color: "danger",
            });
        },
    });

    const handleLogout = () => {
        setAuthToken(null);
        setLoggedInUser(null);
        setUserRole(null);
        navigate(AuthRoutes.login);
    };

    return (
        <div className="w-full max-w-md mx-auto py-8 px-6 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
                <div className="rounded-full bg-kidemia-secondary/5 p-4">
                    <MdOutlineEmail className="text-kidemia-secondary text-3xl" />
                </div>
            </div>

            {/* Title */}
            <div className="space-y-1 text-center">
                <h2 className="text-xl font-semibold text-kidemia-black">
                    Verify your email
                </h2>
                <p className="text-sm text-kidemia-black2">
                    We have sent a verification link to
                </p>
                <p className="text-sm font-medium text-kidemia-black">
                    {loggedInUser?.user?.email}
                </p>
            </div>

            {/* Primary action */}
            <Button
                onPress={() =>
                    (window.location.href = SidebarRoutes.dashboard)
                }
                size="lg"
                className="bg-kidemia-secondary text-white w-full font-medium"
                radius="sm"
            >
                I have verified my email
            </Button>

            {/* Secondary action */}
            <Button
                onPress={() => resendVerificationMutation.mutate()}
                size="lg"
                variant="bordered"
                className="border-kidemia-secondary/50 text-kidemia-secondary w-full font-medium"
                radius="sm"
                isLoading={resendVerificationMutation.isPending}
                isDisabled={resendVerificationMutation.isPending}
            >
                Resend verification email
            </Button>

            {/* Links */}
            <div className="text-center space-y-3 pt-2">
                <button
                    onClick={handleLogout}
                    className="text-sm text-kidemia-secondary hover:underline font-medium"
                >
                    Log out and use another email
                </button>

                <p className="text-xs text-kidemia-black2">
                    Don’t see the email? Check spam or promotions folders.
                </p>
            </div>
        </div>
    );
}
