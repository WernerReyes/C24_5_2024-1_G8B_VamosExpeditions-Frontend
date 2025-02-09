import { useEffect, useState } from "react";
import { InputText, Slider } from "@/presentation/components";
import { useSelector } from "react-redux";
import { AppState } from "@/app/store";

type Props = {
  setRange: (range: [number, number]) => void;
};

export const DaysNumberToAddRoom = ({ setRange }: Props) => {
  const { selectedDay } = useSelector((state: AppState) => state.quotation);
  const [localValue, setLocalValue] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    setRange(localValue);
  }, [localValue]);

  return (
    <div className="flex justify-center">
      <div className="w-48">
        <InputText
          label={{
            text: "Rango de de días",
            htmlFor: "range",
            className: "text-sm",
          }}
          // disabled
          min={1}
          max={selectedDay!.total}
          keyfilter="int"
          value={`${localValue[0]} - ${localValue[1]}`}
          onChange={(e) =>
            setLocalValue(
              e.target.value
                .trim()
                .split("-")
                .map((v) => {
                  if (Number.isNaN(Number(v)) || v === undefined) return 1;
                  if (Number(v) < 1) return 1;
                  if (Number(v) > selectedDay!.total) return selectedDay!.total;
                  return Number(v);
                }) as [number, number]
            )
          }
          invalid={
            localValue[0] > localValue[1] ||
            localValue[1] > selectedDay!.total ||
            localValue[0] > selectedDay!.total
          }
          small={{
            className: "text-red-500",
            text:
              localValue[0] > localValue[1] ||
              localValue[1] > selectedDay!.total ||
              localValue[0] > selectedDay!.total
                ? "Rango inválido"
                : "",
          }}
          className="w-full p-inputtext-sm"
        />

        <Slider
          min={1}
          max={selectedDay!.total}
          range
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.value as [number, number]);
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};
