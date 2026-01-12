import { Button, Card, CardBody, addToast } from "@heroui/react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { useFeatures, useUpdatePlan, usePlans } from "../../hooks/usePlans";
import type { PlanConfigUpdate } from "../../sdk/generated";
import { PlanFormFields } from "./components/PlanFormFields";
import { toNumberOrNull, updatePlanSchema, type UpdatePlanData } from "../../schema/plans.schema";
import BallSpinner from "../../components/Spinner/BallSpinner";
import { SidebarRoutes } from "../../routes";

export const EditPlanPage = () => {
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    const updatePlan = useUpdatePlan();
    const { features } = useFeatures();

    // Fetch individual plan if not passed via state (robust for page refreshes)
    const { plans, isLoading } = usePlans();
    const plan = plans.find((p: any) => p.id === id);

    const { control, handleSubmit, reset, formState: { errors } } =
        useForm<UpdatePlanData>({
            resolver: zodResolver(updatePlanSchema),
        });

    useEffect(() => {
        if (plan) {
            reset({
                plan_name: plan.plan_name ?? "",
                description: plan.description ?? null,
                short_description: plan.short_description ?? null,
                tagline: plan.tagline ?? null,
                price_monthly: plan.price_monthly != null ? String(plan.price_monthly) : "",
                price_yearly: plan.price_yearly != null ? String(plan.price_yearly) : "",
                price_quarterly: plan.price_quarterly != null ? String(plan.price_quarterly) : "",
                max_members: plan.max_members != null ? String(plan.max_members) : null,
                trial_days: plan.trial_days != null ? String(plan.trial_days) : undefined,
                is_active: Boolean(plan.is_active),
                is_featured: Boolean(plan.is_featured),
                is_popular: Boolean(plan.is_popular),
                show_for_individuals: Boolean(plan.show_for_individuals),
                show_for_guardians: Boolean(plan.show_for_guardians),
                show_for_institutions: Boolean(plan.show_for_institutions),
                features: plan.features ?? {},
                benefits_list: Array.isArray(plan.benefits_list) ? plan.benefits_list.join(", ") : "",
            });
        }
    }, [plan, reset]);

    const onSubmit: SubmitHandler<UpdatePlanData> = async (data) => {
        const payload: PlanConfigUpdate = {
            ...data,
            price_monthly: data.price_monthly ? Number(data.price_monthly) : undefined,
            price_yearly: data.price_yearly ? Number(data.price_yearly) : undefined,
            price_quarterly: data.price_quarterly ? Number(data.price_quarterly) : undefined,
            max_members: data.max_members !== undefined ? toNumberOrNull(data.max_members) : undefined,
            trial_days: data.trial_days ? Number(data.trial_days) : undefined,
            benefits_list: data.benefits_list ? data.benefits_list.split(",").map((s) => s.trim()) : undefined,
        };

        await updatePlan.mutateAsync({ planId: id!, data: payload });
        addToast({ title: "Plan updated successfully", color: "success" });
        navigate(SidebarRoutes.plans);
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><BallSpinner /></div>;
    if (!plan) return <div className="p-10 text-center">Plan not found</div>;

    return (
        <section className="p-4 md:p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Button isIconOnly variant="light" radius="full" onPress={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </Button>
                <div className="p-2 bg-kidemia-primary/10 rounded-lg hidden md:block">
                    <Edit2 className="h-6 w-6 text-kidemia-primary" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Edit Plan</h1>
                    <p className="text-xs md:text-sm text-gray-600">Modify {plan.plan_name} configuration</p>
                </div>
            </div>

            <Card className="max-w-5xl border-none shadow-sm">
                <CardBody className="p-4 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <PlanFormFields
                            control={control}
                            errors={errors}
                            isPending={updatePlan.isPending}
                            availableFeatures={features}
                            isEdit
                        />

                        <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                            <Button variant="flat" className="w-full md:w-auto" onPress={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                className="bg-kidemia-secondary text-white w-full md:w-auto font-medium"
                                isLoading={updatePlan.isPending}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </section>
    );
};