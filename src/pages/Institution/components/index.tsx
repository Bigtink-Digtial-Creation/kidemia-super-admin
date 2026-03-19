import { type ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "green" | "orange" | "red" | "gray" | "purple" | "blue";
}

const variantMap = {
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-100 text-gray-500",
    purple: "bg-purple-50 text-purple-700",
    blue: "bg-blue-50 text-blue-700",
};

export function Badge({ children, variant = "gray" }: BadgeProps) {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variantMap[variant]}`}>
            {children}
        </span>
    );
}

interface BtnProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md";
    disabled?: boolean;
    type?: "button" | "submit";
    fullWidth?: boolean;
    icon?: ReactNode;
}

export function Btn({ children, onClick, variant = "primary", size = "md", disabled, type = "button", fullWidth, icon }: BtnProps) {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed";
    const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm" };
    const variants = {
        primary: "text-white shadow-sm hover:opacity-90 active:scale-95",
        secondary: "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
        ghost: "text-gray-500 hover:bg-gray-100",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
            style={variant === "primary" ? { backgroundColor: "#e07b39" } : {}}
        >
            {icon}
            {children}
        </button>
    );
}

interface AvatarProps {
    name: string;
    size?: "sm" | "md";
}

export function Avatar({ name, size = "md" }: AvatarProps) {
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
    return (
        <div className={`${sz} rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold flex-shrink-0`}>
            {initials}
        </div>
    );
}

interface ScoreProps { value: number }

export function Score({ value }: ScoreProps) {
    const color = value >= 80 ? "text-green-600" : value >= 60 ? "text-orange-500" : "text-red-500";
    return <span className={`font-semibold ${color}`}>{value}%</span>;
}

interface EmptyStateProps { title: string; description?: string; icon?: ReactNode }

export function EmptyState({ title, description, icon }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {icon && <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">{icon}</div>}
            <h3 className="text-base font-bold text-gray-700">{title}</h3>
            {description && <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>}
        </div>
    );
}