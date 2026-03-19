import { TIERS } from "../../utils";


interface TierBadgeProps {
    tier: string; // TierKey is ideal, but backend can return invalid values, so we use string and fallback to basic tier in such cases
}

export default function TierBadge({ tier }: TierBadgeProps) {
    const t = TIERS[tier] ?? TIERS.basic;
    const Icon = t.icon;
    return (
        <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ color: t.color, backgroundColor: t.bg }}
        >
            <Icon size={10} />
            {t.label}
        </span>
    );
}
