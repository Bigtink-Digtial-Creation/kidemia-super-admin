// export default function SignUpPage() {
//   return (
//     <div>SignUp</div>
//   )
// }

import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "../../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useAtom, useSetAtom } from "jotai";
// import { signupFormData, signupInfoStep } from "../../store/auth.atom";
import { addToast, Button, Form, Input } from "@heroui/react";
import { MdOutlineEmail } from "react-icons/md";
import { BiScan, BiUser } from "react-icons/bi";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { AuthRoutes } from "../../routes";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest, UserType } from "../../sdk/generated";
import { ApiSDK } from "../../sdk";
import { apiErrorParser } from "../../utils/errorParser";

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(SignUpSchema),
  });

  const signUpMutation = useMutation({
    mutationFn: (formData: RegisterRequest) =>
      ApiSDK.AuthenticationService.registerApiV1AuthRegisterPost(formData),
    onSuccess(data) {
      if (data) {
        navigate(AuthRoutes.login);
        addToast({
          title: data?.message,
          color: "success",
        });
      }
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

  const onSubmit = (data: SignUpSchema) => {
    console.log(data);
    const payload = {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      user_type: "platform_admin" as UserType,
    };

    signUpMutation.mutate(payload);
  };

  return (
    <div className="space-y-4">
      <Form className="py-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-2 w-full flex items-center gap-4">
          <Input
            variant="flat"
            size="lg"
            radius="sm"
            startContent={
              <BiUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            placeholder="Your Firstname"
            type="text"
            {...register("first_name")}
            isInvalid={!!errors?.first_name?.message}
            errorMessage={errors?.first_name?.message}
            isDisabled={signUpMutation.isPending}
          />
          <Input
            variant="flat"
            size="lg"
            radius="sm"
            startContent={
              <BiUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            placeholder="Your Lastname"
            type="text"
            {...register("last_name")}
            isInvalid={!!errors?.last_name?.message}
            errorMessage={errors?.last_name?.message}
            isDisabled={signUpMutation.isPending}
          />
        </div>
        <div className="pb-2 w-full">
          <Input
            variant="flat"
            size="lg"
            radius="sm"
            startContent={
              <MdOutlineEmail className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
            }
            placeholder="Your email"
            type="email"
            {...register("email")}
            isInvalid={!!errors?.email?.message}
            errorMessage={errors?.email?.message}
            isDisabled={signUpMutation.isPending}
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
            {...register("password")}
            isInvalid={!!errors?.password?.message}
            errorMessage={errors?.password?.message}
            isDisabled={signUpMutation.isPending}
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
            placeholder="Confirm Password"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("confirmPassword")}
            isInvalid={!!errors?.confirmPassword?.message}
            errorMessage={errors?.confirmPassword?.message}
            isDisabled={signUpMutation.isPending}
          />
        </div>

        <div className="py-4 w-full">
          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
            radius="sm"
            isDisabled={signUpMutation.isPending}
            isLoading={signUpMutation.isPending}
          >
            Sign Up
          </Button>
        </div>
      </Form>

      <div className="w-full flex justify-center items-center">
        <p className="text-base text-kidemia-black font-medium text-center">
          I have an account{" "}
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
