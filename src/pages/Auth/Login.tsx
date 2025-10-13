import { useState } from "react";
import { useSetAtom } from "jotai";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { addToast, Button, Form, Input, Switch } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEmail } from "react-icons/md";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { BiScan } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { loggedinUserAtom, storedAuthTokenAtom } from "../../store/user.atom";
import { LoginSchema } from "../../schema/auth.schema";
import type { LoginRequest } from "../../sdk/generated";
import { ApiSDK } from "../../sdk";
import { AuthRoutes, SidebarRoutes } from "../../routes";
import { apiErrorParser } from "../../utils/errorParser";


export default function LoginPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const setStoredToken = useSetAtom(storedAuthTokenAtom);
  const setLoggedInUser = useSetAtom(loggedinUserAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (formData: LoginRequest) =>
      ApiSDK.AuthenticationService.loginApiV1AuthLoginPost(formData),
    onSuccess(data) {
      if (data) {
        const token = data.access_token;
        ApiSDK.OpenAPI.TOKEN = token;
        setStoredToken(token);
        setLoggedInUser(data);
        navigate(SidebarRoutes.dashboard, { replace: true });
        addToast({
          title: "Login Successful",
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

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="py-4 w-full md:w-2xl space-y-6 md:px-12">
      <div className="space-y-3">
        <h2 className="text-3xl text-kidemia-black font-semibold text-center">
          Welcome Back
        </h2>
        <p className="text-lg text-kidemia-black2 text-center font-medium">
          Sign In to continue
        </p>
      </div>

      <Form className="py-6 space-y-2" onSubmit={handleSubmit(onSubmit)}>
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
            isDisabled={loginMutation.isPending}
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
            placeholder="Password"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="sm"
            {...register("password")}
            isInvalid={!!errors?.password?.message}
            errorMessage={errors?.password?.message}
            isDisabled={loginMutation.isPending}
          />

          <div className="flex items-center justify-between pt-1">
            <Switch
              size="sm"
              color="warning"
              {...register("remember_me")}
              classNames={{
                label: "text-kidemia-secondary text-sm font-medium",
              }}
              isDisabled={loginMutation.isPending}
            >
              Remember me
            </Switch>
            <Link
              to={AuthRoutes.forgotPassword}
              className="text-kidemia-secondary text-sm font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="py-4 w-full">
          <Button
            type="submit"
            variant="solid"
            size="lg"
            className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
            radius="sm"
            isDisabled={loginMutation.isPending}
            isLoading={loginMutation.isPending}
          >
            Sign In
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
