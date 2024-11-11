import { classNamesAdapter } from "@/core/adapters";

type  StatsOverviewProps = {
  title: string;
  icon: string;
  value: string;
  extraInfo: string;
}

export const StatsOverviewCard = ({
  title,
  value,
  icon,
  extraInfo,
}: StatsOverviewProps) => {
  return (
    <div className="w-full px-4 flex flex-col justify-center bg-white border col-span-4 md:col-span-2 lg:col-span-1 shadow-md rounded-md h-40 max-w-screen-lg">
      <div className="flex justify-between">
        <h3 className="text-md font-semibold text-tertiary sm:max-w-48 lg:max-w-fit">
          {title}
        </h3>
        <i className={classNamesAdapter(icon, "text-xl text-primary")}></i>
      </div>
      <span className="text-4xl md:text-2xl xl:text-4xl font-extrabold text-tertiary block">
        {value}
      </span>
      <span className="text-md text-slate-500">{extraInfo}</span>
    </div>
  );
};
