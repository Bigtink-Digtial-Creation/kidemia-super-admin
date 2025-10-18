import { Card, CardBody } from "@heroui/react";
import type { StatsCardProps } from "../../pages/Dashboard/dashboard.interface";

export default function StatCard({ icon, title, figure }: StatsCardProps) {
  const IconComponent = icon;
  return (
    <Card className="border-none bg-background/60 dark:bg-default-100/50">
      <CardBody className="flex justify-center- items-center-">
        <div className="flex py-6 px-4  items-center gap-6">
          <div className="w-14 h-14 rounded-full shadow-sm flex items-center justify-center bg-kidemia-biege aspect-square">
            <IconComponent className="text-2xl text-kidemia-primary font-bold" />
          </div>

          <div className="flex flex-col justify-center items-center space-y-4">
            <p className="text-base  text-kidemia-grey">{title}</p>

            <h3 className="text-4xl font-bold text-kidemia-black text-center-">
              {figure}
            </h3>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
