import {
    Checkbox,
    CheckboxGroup,
    Divider,
    Input,
    Select,
    SelectItem,
    Switch,
    Textarea,
} from "@heroui/react";
import { Controller } from "react-hook-form";

export const PlanFormFields = ({
    control,
    errors,
    isPending,
    availableFeatures,
    isEdit = false,
}: any) => (
    <div className="space-y-6 pb-4">
        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">
            <Controller
                name="plan_name"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        label="Plan Name"
                        variant="bordered"
                        isInvalid={!!errors.plan_name}
                        errorMessage={errors.plan_name?.message}
                        isDisabled={isPending}
                    />
                )}
            />

            <Controller
                name="plan_code"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        label="Plan Code"
                        variant="bordered"
                        isDisabled={isEdit || isPending}
                        placeholder={isEdit ? "Cannot change code" : "e.g. basic_monthly"}
                    />
                )}
            />
        </div>

        {/* PLAN TYPE */}
        {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    name="plan_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Plan Type"
                            variant="bordered"
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={(k) =>
                                field.onChange(Array.from(k)[0])
                            }
                        >
                            {[
                                "free",
                                "student",
                                "sibling",
                                "family",
                                "institution",
                                "custom",
                            ].map((t) => (
                                <SelectItem key={t}>{t}</SelectItem>
                            ))}
                        </Select>
                    )}
                />

                <Controller
                    name="subscription_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Category"
                            variant="bordered"
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={(k) =>
                                field.onChange(Array.from(k)[0])
                            }
                        >
                            {["individual", "family", "institution"].map((t) => (
                                <SelectItem key={t}>{t}</SelectItem>
                            ))}
                        </Select>
                    )}
                />
            </div>
        )}

        {/* DESCRIPTIONS */}
        <div className="grid grid-cols-2 gap-4">
            <Controller
                name="short_description"
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        label="Short Description"
                        variant="bordered"
                        placeholder="Brief summary shown on cards"
                        isInvalid={!!errors.short_description}
                        errorMessage={errors.short_description?.message}
                    />
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        label="Full Description"
                        variant="bordered"
                        placeholder="Detailed plan description"
                        isInvalid={!!errors.description}
                        errorMessage={errors.description?.message}
                    />
                )}
            />
        </div>

        {/* PRICING */}
        <div className="grid grid-cols-3 gap-3">
            {[
                { name: "price_monthly", label: "Monthly" },
                { name: "price_yearly", label: "Yearly" },
                { name: "price_quarterly", label: "Quarterly" },
            ].map(({ name, label }) => (
                <Controller
                    key={name}
                    name={name}
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            type="number"
                            label={label}
                            variant="bordered"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            isInvalid={fieldState.invalid}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            ))}

            <Controller
                name="trial_days"
                control={control}
                render={({ field, fieldState }) => (
                    <Input
                        {...field}
                        type="number"
                        label="Trial Days"
                        variant="bordered"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        isInvalid={fieldState.invalid}
                        errorMessage={fieldState.error?.message}
                    />
                )}
            />
        </div>

        {/* VISIBILITY & FLAGS */}
        <div className="grid grid-cols-2 gap-4">
            {[
                { name: "is_popular", label: "Popular Plan", color: "warning" },
                { name: "is_active", label: "Active Status", color: "success" },
                { name: "is_featured", label: "Featured Plan", color: "primary" },
                { name: "show_for_individuals", label: "Visible to Individuals" },
                { name: "show_for_guardians", label: "Visible to Guardians" },
                { name: "show_for_institutions", label: "Visible to Institutions" },
            ].map(({ name, label, color }) => (
                <Controller
                    key={name}
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <div className="flex justify-between items-center px-3 py-2 border rounded-lg">
                            <span className="text-small font-medium">{label}</span>
                            <Switch
                                size="sm"
                                isSelected={!!field.value}
                                onValueChange={field.onChange}
                                color={color as any}
                            />
                        </div>
                    )}
                />
            ))}
        </div>

        <Divider />

        {/* FEATURES */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-bold text-gray-700">
                Select Plan Features
            </p>

            <Controller
                name="features"
                control={control}
                render={({ field }) => {
                    const selected = Object.keys(field.value || {}).filter(
                        (k) => field.value[k]
                    );

                    return (
                        <CheckboxGroup
                            orientation="horizontal"
                            value={selected}
                            onValueChange={(vals) => {
                                const map: Record<string, boolean> = {};
                                vals.forEach((v) => (map[v.toString()] = true));
                                field.onChange(map);
                            }}
                            className="gap-4"
                        >
                            {availableFeatures?.map((f: any) => (
                                <Checkbox
                                    key={f.feature_code}
                                    value={f.feature_code}
                                    size="sm"
                                >
                                    {f.icon} {f.feature_name}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    );
                }}
            />
        </div>

        {/* BENEFITS */}
        <Controller
            name="benefits_list"
            control={control}
            render={({ field }) => (
                <Textarea
                    {...field}
                    label="Display Benefits (comma separated)"
                    placeholder="AI Reports, 24/7 Support"
                    variant="bordered"
                />
            )}
        />
    </div>
);
