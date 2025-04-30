import { cn } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import type { ExtraReservationsStatsInfo } from "@/infraestructure/store/services";
import { Card } from "@/presentation/components";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import { useSidebar } from "../../hooks";

type StatsOverviewProps = {
  title: string;
  icon: string;
  extraInfo?: ExtraReservationsStatsInfo;
  type?: "currency" | "quantity" | "percentage";
};

const OVERLAY_TYPES = {
  CURRENT_MONTH: {
    label: "Mes actual",
    value: "totalCurrentMonth",
  },
  LAST_MONTH: {
    label: "Mes anterior",
    value: "totalPreviousMonth",
  },
  TOTAL: {
    label: "Total",
    value: "total",
  },
};

export const StatsOverviewCard = ({
  title,
  icon,
  extraInfo,
  type = "quantity",
}: StatsOverviewProps) => {

   const { visible } = useSidebar();
  
  const op = useRef<any>(null);
  const [selectedOverlayType, setSelectedOverlayType] = useState(
    OVERLAY_TYPES.CURRENT_MONTH
  );

  if (!extraInfo) return null;
  return (
    <Card
      className={cn(
        "w-full shadow-md rounded-md col-span-4 md:col-span-2 xl:col-span-1 max-w-screen-lg",
        visible ? "lg:col-span-2" : "lg:col-span-1"

      )}
    >
      <div className="flex justify-between">
        <h3 className="text-sm md:text-lg font-semibold text-tertiary sm:max-w-48 lg:max-w-fit">
          {title}
        </h3>
        <i className={cn(icon, "text-xl text-primary")}></i>
      </div>
      <span className="text-4xl md:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-tertiary block">
        {type === "currency" &&
          formatCurrency(
            extraInfo[
              selectedOverlayType.value as keyof ExtraReservationsStatsInfo
            ]
          )}
        {type === "quantity" &&
          extraInfo[
            selectedOverlayType.value as keyof ExtraReservationsStatsInfo
          ]}
        {type === "percentage" &&
          extraInfo[
            selectedOverlayType.value as keyof ExtraReservationsStatsInfo
          ] + "%"}
      </span>
      <div className="flex items-center gap-x-2 justify-between">
        <span className="text-sm text-slate-500">
          {selectedOverlayType.value === "totalCurrentMonth"
            ? `${extraInfo.increase > 0 ? "+" : ""}${
                extraInfo.increase
              }% desde el mes anterior`
            : ""}
        </span>

        <div
          className="flex items-center gap-x-1 cursor-pointer"
          onClick={(e) => op?.current?.toggle(e)}
        >
          <span className="text-slate-500 text-sm">
            {selectedOverlayType.label}
          </span>
          <i className="pi pi-chevron-down text-slate-500"></i>
        </div>
        <OverlayPanel className="!z-10" ref={op}>
          {Object.values(OVERLAY_TYPES).map((overlayType) => (
            <div
              key={overlayType.value}
              onClick={() => setSelectedOverlayType(overlayType)}
              className={cn(
                "cursor-pointer p-2 hover:bg-gray-100 rounded-sm",
                selectedOverlayType.value === overlayType.value && "bg-gray-100"
              )}
            >
              {overlayType.label}
            </div>
          ))}
        </OverlayPanel>
      </div>
    </Card>
  );
};
