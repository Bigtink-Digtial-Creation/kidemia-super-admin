import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Button, Form, Input } from "@heroui/react";
import { BiScan } from "react-icons/bi";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordSchema } from "../../schema/auth.schema";
import type { ChangePasswordRequest } from "../../sdk/generated";
import { ApiSDK } from "../../sdk";
import { AuthRoutes } from "../../routes";
import { apiErrorParser } from "../../utils/errorParser";

export default function ChangePasswordPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (formData: ChangePasswordRequest) =>
      ApiSDK.AuthenticationService.changePasswordApiV1AuthChangePasswordPost(
        formData,
      ),
    onSuccess(data) {
      addToast({
        title: data?.message,
        color: "success",
      });
      navigate(AuthRoutes.login);
    },
    onError(error) {
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
    },
  });
  const onSubmit = (data: ChangePasswordSchema) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="py-4 w-full md:w-2xl space-y-6 md:px-12">
      <div className="space-y-3">
        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
          Change Password
        </h2>
        <p className="text-lg text-kidemia-black2 text-center font-medium">
          Do well not to forget your password this time
        </p>
      </div>

      <Form className="py-6 space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-2 w-full space-y-2">
          <Input
            startContent={
              <BiScan className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaEyeSlash className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                ) : (
                  <FaRegEye className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                )}
              </button>
            }
            placeholder="Current Password"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("current_password")}
            isInvalid={!!errors?.current_password?.message}
            errorMessage={errors?.current_password?.message}
            isDisabled={changePasswordMutation.isPending}
          />
        </div>

        <div className="pb-2 w-full space-y-2">
          <Input
            startContent={
              <BiScan className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaEyeSlash className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                ) : (
                  <FaRegEye className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                )}
              </button>
            }
            placeholder="New Password"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("new_password")}
            isInvalid={!!errors?.new_password?.message}
            errorMessage={errors?.new_password?.message}
            isDisabled={changePasswordMutation.isPending}
          />
        </div>

        <div className="py-4 w-full">
          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
            radius="sm"
            isDisabled={changePasswordMutation.isPending}
            isLoading={changePasswordMutation.isPending}
          >
            Continue
          </Button>
        </div>
      </Form>

      <div className="w-full">
        <p className="text-base text-kidemia-black font-medium text-center">
          I don't have an account{" "}
          <Link
            to={AuthRoutes.signup}
            className="text-kidemia-secondary font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
