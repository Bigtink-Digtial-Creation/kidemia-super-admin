import type { IconType } from "react-icons";

export interface StatsCardProps {
  icon: IconType;
  title: string;
  figure: string | number;
  sub?: string;
}
