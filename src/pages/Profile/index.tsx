import React, { useEffect, useState } from "react";
import {
  addToast,
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Form,
  Input,
  Textarea,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdOutlineEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
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
import BallSpinner from "../../components/Spinner/BallSpinner";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const storedUser = useAtomValue(loggedinUserAtom);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.profile_picture_url ?? null);
      form.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        middle_name: user.middle_name || "",
        profile_picture_url: user.profile_picture_url || "",
        phone_number: user.phone_number || "",
        date_of_birth: user.date_of_birth || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: (userData: UserUpdate) =>
      ApiSDK.UsersService.updateUserApiV1UsersUserIdPatch(
        user?.id as string,
        userData,
      ),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.user] });
      addToast({
        description: "Profile updated successfully",
        color: "success",
      });
    },
    onError(error) {
      addToast({
        title: "Update Failed",
        description: apiErrorParser(error).message,
        color: "danger",
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = { file };
      return await ApiSDK.UploadService.updateAvatarApiV1ApiUploadAccountAvatarPatch(formData);
    },
    onSuccess: (response) => {
      updateProfileMutation.mutate({
        profile_picture_url: response.url
      });
      setAvatarUrl(response.url);
      addToast({ color: "success", description: "Avatar uploaded!" });
    },
    onError: (error) => {
      addToast({
        color: "danger",
        description: apiErrorParser(error).message || "Upload failed"
      });
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast({ color: "danger", description: "Invalid file type (JPG, PNG, WEBP only)" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addToast({ color: "danger", description: "File size must be under 10MB" });
      return;
    }

    await uploadAvatarMutation.mutateAsync(file);
  };

  const onSubmit = (profileData: ProfileSchema) => {
    updateProfileMutation.mutate(profileData);
  };

  if (isUserLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <BallSpinner />
      </div>
    );
  }

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <Breadcrumbs variant="light" color="foreground">
          <BreadcrumbItem href={SidebarRoutes.dashboard} startContent={<MdOutlineDashboard />}>
            Dashboard
          </BreadcrumbItem>
          <BreadcrumbItem href={SidebarRoutes.profile} startContent={<FaUser />} color="warning">
            Profile
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="w-full shadow-sm bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex flex-col items-center gap-6 py-10 px-4 md:px-10">

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <Avatar
                src={avatarUrl ?? undefined}
                className="w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-transform duration-300 hover:scale-105"
                isBordered
                color="warning"
                name={getNameIntials(fullName) as string}
              />
              {uploadAvatarMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 bg-kidemia-secondary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-kidemia-primary transition-colors"
              >
                <BiUser size={20} />
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadAvatarMutation.isPending}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              {uploadAvatarMutation.isPending ? "Uploading..." : "Click icon to change photo"}
            </p>
          </div>

          <Form
            className="w-full max-w-3xl space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Read-Only Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                variant="flat"
                label="Email Address"
                value={user?.email}
                startContent={<MdOutlineEmail className="text-gray-400" />}
                isDisabled
              />
              <Input
                variant="flat"
                label="Account Type"
                value={user?.user_type}
                startContent={<GrUserWorker className="text-gray-400" />}
                isDisabled
              />
            </div>

            {/* Editable Name Row - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                variant="bordered"
                label="First Name"
                {...form.register("first_name")}
                startContent={<BiUser className="text-gray-400" />}
              />
              <Input
                variant="bordered"
                label="Last Name"
                {...form.register("last_name")}
                startContent={<BiUser className="text-gray-400" />}
              />
            </div>

            <Input
              variant="bordered"
              label="Middle Name"
              {...form.register("middle_name")}
              startContent={<BiUser className="text-gray-400" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                variant="bordered"
                label="Phone Number"
                {...form.register("phone_number")}
                startContent={<SlScreenSmartphone className="text-gray-400" />}
              />
              <Input
                variant="bordered"
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                {...form.register("date_of_birth")}
                startContent={<BsCalendarDate className="text-gray-400" />}
              />
            </div>

            <Textarea
              variant="bordered"
              label="Bio"
              placeholder="Tell us about yourself..."
              {...form.register("bio")}
              startContent={<BiDetail className="text-gray-400 mt-1" />}
            />

            <div className="pt-4">
              <Button
                type="submit"
                color="warning"
                size="lg"
                className="w-full md:w-auto px-12 font-bold text-white shadow-lg shadow-warning/20"
                isLoading={updateProfileMutation.isPending}
                isDisabled={uploadAvatarMutation.isPending}
              >
                Update Profile
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}