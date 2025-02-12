import type { AppState } from "@/app/store";
import { InputText, Slider } from "@/presentation/components";
import {
  useEffect,
  useState
} from "react";
import { useSelector } from "react-redux";

import "./DaysNumberToAddRoom.css";

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
        <div className="flex flex-column align-items-center">
          <div className="flex justify-center items-center gap-2">
            <InputText
              keyfilter="int"
              value={localValue[0].toString()}
              onChange={(e) =>
                setLocalValue([
                  (() => {
                    const value = Number(e.target.value.slice(1) ?? 1);
                    if (value > selectedDay!.total) return selectedDay!.total;
                    if (value > localValue[1]) return localValue[1];
                    if (value < 1) return 1;
                    return value;
                  })(),
                  localValue[1],
                ])
              }
              type="text"
              className="custom-otp-input-sample p-inputtext-sm"
            />
            <p className="text-4xl font-light">-</p>
            <InputText
              keyfilter="int"
              value={localValue[1].toString()}
              onChange={(e) =>
                setLocalValue([
                  localValue[0],
                  (() => {
                    const value = Number(e.target.value.slice(1) ?? 1);
                    if (value > selectedDay!.total) return selectedDay!.total;
                    if (value < 1) return 1;
                    return value;
                  })(),
                ])
              }
              type="text"
              className="custom-otp-input-sample p-inputtext-sm"
            />
          </div>
        </div>

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
