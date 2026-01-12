import { Button, Card, CardBody, addToast } from "@heroui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react"; // Icons for consistency

import { useCreatePlan, useFeatures } from "../../hooks/usePlans";
import { createPlanSchema, toNumberOrNull, toNumberOrUndefined, type CreatePlanData } from "../../schema/plans.schema";
import type { PlanConfigCreate } from "../../sdk/generated";
import { PlanFormFields } from "./components/PlanFormFields";
import { SidebarRoutes } from "../../routes";

export const CreatePlanPage = () => {
    const navigate = useNavigate();
    const createPlan = useCreatePlan();
    const { features } = useFeatures();

    const { control, handleSubmit, formState: { errors } } =
        useForm<CreatePlanData>({
            resolver: zodResolver(createPlanSchema),
            defaultValues: {
                plan_type: "student",
                subscription_type: "individual",
                is_active: true,
                is_featured: false,
                is_popular: false,
                show_for_individuals: true,
                show_for_guardians: true,
                show_for_institutions: true,
                features: {},
            },
        });

    const onSubmit: SubmitHandler<CreatePlanData> = async (data) => {
        const payload: PlanConfigCreate = {
            ...data,
            price_monthly: Number(data.price_monthly),
            price_yearly: Number(data.price_yearly),
            price_quarterly: toNumberOrNull(data.price_quarterly),
            max_members: toNumberOrNull(data.max_members),
            trial_days: toNumberOrUndefined(data.trial_days),
            benefits_list: data.benefits_list ? data.benefits_list.split(",").map((s) => s.trim()) : [],
        };

        await createPlan.mutateAsync(payload);
        addToast({ title: "Plan created successfully", color: "success" });
        navigate(SidebarRoutes.plans);
    };

    return (
        <section className="p-4 md:p-6 space-y-6">
            {/* Header consistent with Index page */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        onPress={() => navigate(-1)}
                        className="md:hidden"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div className="p-2 bg-kidemia-primary/10 rounded-lg hidden md:block">
                        <Plus className="h-6 w-6 text-kidemia-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Create New Plan</h1>
                        <p className="text-xs md:text-sm text-gray-600">Set up a new subscription tier</p>
                    </div>
                </div>
            </div>

            <Card className="max-w-5xl border-none shadow-sm">
                <CardBody className="p-4 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <PlanFormFields
                            control={control}
                            errors={errors}
                            isPending={createPlan.isPending}
                            availableFeatures={features}
                        />

                        <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                            <Button
                                variant="flat"
                                className="w-full md:w-auto"
                                onPress={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                className="bg-kidemia-secondary text-white w-full md:w-auto font-medium"
                                isLoading={createPlan.isPending}
                            >
                                Create Plan
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </section>
    );
};