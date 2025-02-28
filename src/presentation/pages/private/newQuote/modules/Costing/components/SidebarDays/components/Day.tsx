import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { classNamesAdapter } from "@/core/adapters";
import { onSetSelectedDay } from "@/infraestructure/store";

export const Day = () => {
  const dispatch = useDispatch();

  const { days, selectedDay } = useSelector(
    (state: AppState) => state.quotation
  );
  return (
    <>
      {days.map((day, index) => (
        <li
          key={day.id}
          onClick={() => dispatch(onSetSelectedDay(day))}
          className={classNamesAdapter(
            "p-4 rounded-lg cursor-pointer text-sm md:text-base",
            selectedDay?.id === day.id
              ? "bg-primary text-white"
              : "bg-secondary hover:bg-gray-300"
          )}
        >
          <div className="flex items-center space-x-5">
            <p
              className={classNamesAdapter(
                "font-semibold rounded-full flex items-center justify-center min-w-8 min-h-8",
                selectedDay?.id === day.id
                  ? "bg-white text-primary"
                  : "bg-tertiary text-white"
              )}
            >
              <span>{index + 1}</span>
            </p>
            <div className="flex items-start flex-col">
              <p className="font-semibold">{day.name}</p>
              <p className="text-xs md:text-sm">{day.formattedDate}</p>
            </div>
          </div>
        </li>
      ))}
    </>
  );
};
