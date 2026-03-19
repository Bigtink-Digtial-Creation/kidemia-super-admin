import { Crown, Star, Zap } from "lucide-react";

export type TierKey = "basic" | "premium" | "enterprise";


export interface Institution {
    id: number;
    name: string;
    code: string;
    city: string;
    state: string;
    country: string;
    tier: TierKey;
    is_active: boolean;
    is_verified: boolean;
    total_students: number;
    total_teachers: number;
    owner_email: string;
    created_at: string;
}
interface TierConfig {
    label: string;
    color: string;
    bg: string;
    icon: React.ElementType;
}


export const TIERS: Record<string, TierConfig> = {
    basic: { label: "Basic", color: "#6b7280", bg: "#f3f4f6", icon: Star },
    premium: { label: "Premium", color: "#f59e0b", bg: "#eff6ff", icon: Crown },
    enterprise: { label: "Enterprise", color: "#8b5cf6", bg: "#f5f3ff", icon: Zap },
};