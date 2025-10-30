/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  addToast,
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Form,
  Input,
  Spinner,
  Textarea,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdOutlineEmail } from "react-icons/md";
import { FaCamera, FaUser } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../store/user.atom";
import { BiDetail, BiUser } from "react-icons/bi";
import { getNameIntials } from "../../utils";
import { BsCalendarDate } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";
import { SlScreenSmartphone } from "react-icons/sl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserUpdate } from "../../sdk/generated";
import { apiErrorParser } from "../../utils/errorParser";
import { ProfileSchema } from "../../schema/auth.schema";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const storedUser = useAtomValue(loggedinUserAtom);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(ProfileSchema),
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [QueryKeys.user],
    queryFn: () =>
      ApiSDK.UsersService.getUserApiV1UsersUserIdGet(
        storedUser?.user?.id as string,
      ),
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.profile_picture_url as string,
  );

  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        middle_name: user.middle_name || "",
        profile_picture_url: user.profile_picture_url || avatarUrl,
        phone_number: user.phone_number || "",
        date_of_birth: user.date_of_birth || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [avatarUrl, form, user]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilepicture", file);

    // create a preview from uploaded file
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  };

  const updateProfileMutation = useMutation({
    mutationFn: (userData: UserUpdate) =>
      ApiSDK.UsersService.updateUserApiV1UsersUserIdPatch(
        user?.id as string,
        userData,
      ),
    async onMutate(updatedUser) {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.user] });
      const previousUser = queryClient.getQueryData([QueryKeys.user]);

      queryClient.setQueryData([QueryKeys.user], (old: any) => ({
        ...old,
        ...updatedUser,
      }));

      return { previousUser };
    },

    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.user] });
      addToast({
        description: `${data.first_name} profile updated successfully`,
        color: "success",
      });
    },

    onError(error, _, context) {
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occurred",
        description: parsedError.message,
        color: "danger",
      });

      if (context?.previousUser) {
        queryClient.setQueryData([QueryKeys.user], context.previousUser);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.user] });
    },
  });

  const onSubmit = (profileData: ProfileSchema) => {
    updateProfileMutation.mutate(profileData);
  };

  if (isUserLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }
  return (
    <>
      <div className="space-y-6">
        <div>
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem
              href={SidebarRoutes.dashboard}
              startContent={<MdOutlineDashboard />}
            >
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem
              href={SidebarRoutes.profile}
              startContent={<FaUser />}
                          color="warning"
            >
              Profile
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className="h-full w-full shadow-none md:shadow-sm bg-kidemia-biege2 rounded-2xl overflow-y-auto">
          <div className="flex flex-col justify-center items-center gap-3 py-4 px-6 md:px-12 lg:px-20">
            <Form
              className="space-y-4 w-full max-w-2xl flex  justify-center items-center"
              {...form}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="group flex justify-center items-center relative">
                <Avatar
                  src={
                    (avatarUrl as string) ||
                    (user?.profile_picture_url as string)
                  }
                  className="w-40 h-40 self-center cursor-pointer uppercase font-extrabold text-kidemia-primary text-4xl"
                  isBordered
                  showFallback
                  name={getNameIntials(fullName) as string}
                />

                <div className="hidden group-hover:block z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200">
                  <div className="relative flex justify-center items-center">
                    <FaCamera
                      size={30}
                      className="text-yellow-300 cursor-pointer"
                    />
                    <label
                      htmlFor="profile"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 z-50 w-full h-full"
                    ></label>
                  </div>
                  <Input
                    id="profile"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUpload(e)}
                  />
                </div>
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <MdOutlineEmail className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="email"
                  label="Your Email"
                  labelPlacement="inside"
                  {...form.register("email")}
                  defaultValue={user?.email}
                  isDisabled
                />
              </div>
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <GrUserWorker className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  label="User Type"
                  labelPlacement="inside"
                  defaultValue={user?.user_type}
                  isDisabled
                />
              </div>

              <div className="pb-2 w-full flex items-center gap-4">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <BiUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  label="Firstname"
                  type="text"
                  labelPlacement="inside"
                  {...form.register("first_name")}
                  defaultValue={user?.first_name}
                  isDisabled={updateProfileMutation.isPending}
                />
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <BiUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  label="Lastname"
                  type="text"
                  labelPlacement="inside"
                  {...form.register("last_name")}
                  defaultValue={user?.last_name}
                  isDisabled={updateProfileMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <BiUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  label="Middle Name"
                  labelPlacement="inside"
                  {...form.register("middle_name")}
                  defaultValue={user?.middle_name || ""}
                  isDisabled={updateProfileMutation.isPending}
                />
              </div>
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <SlScreenSmartphone className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  label="Phone Number"
                  labelPlacement="inside"
                  {...form.register("phone_number")}
                  defaultValue={user?.phone_number || ""}
                  isDisabled={updateProfileMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <BsCalendarDate className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  label="Date of Birth"
                  labelPlacement="inside"
                  {...form.register("date_of_birth")}
                  defaultValue={user?.date_of_birth || ""}
                  isDisabled={updateProfileMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                <Textarea
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <BiDetail className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  label="Bio"
                  {...form.register("bio")}
                  defaultValue={user?.bio || ""}
                  isDisabled={updateProfileMutation.isPending}
                />
              </div>

              <div className="py-4 w-full">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                  isDisabled={updateProfileMutation.isPending}
                  isLoading={updateProfileMutation.isPending}
                >
                  Update Profile
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
