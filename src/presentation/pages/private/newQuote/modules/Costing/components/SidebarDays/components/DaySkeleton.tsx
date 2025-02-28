import type { AppState } from "@/app/store";
import { classNamesAdapter } from "@/core/adapters";
import { Skeleton } from "@/presentation/components";
import { useSelector } from "react-redux";

type Props = {
  length: number;
};

export const DaySkeleton = ({ length }: Props) => {
  const { selectedDay } = useSelector((state: AppState) => state.quotation);
  return Array.from({ length }).map((_, index) => (
    <li
      key={index}
      className={classNamesAdapter(
        "p-4 flex items-center rounded-lg h-24 animate-pulse",
        selectedDay?.id === index + 1
          ? "bg-primary text-white"
          : "bg-secondary hover:bg-gray-300"
      )}
    >
      <div className="flex items-center space-x-5">
        {/* Número del día (círculo) */}
        <Skeleton shape="circle" size="36px" className="bg-gray-300" />

        {/* Información del día */}
        <div className="flex items-start flex-col space-y-1">
          <Skeleton width="80px" height="16px" className="bg-gray-300" />
          <Skeleton width="100px" height="12px" className="bg-gray-300" />
        </div>
      </div>
    </li>
  ));
};
