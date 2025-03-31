import type { AppState } from "@/app/store";
import {
  Checkbox,
  InputNumber,
  Slider
} from "@/presentation/components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./DaysNumberToAddRoom.css";

type Props = {
  setRange: (range: [number, number]) => void;
  setAutoCompleteDay: (autoComplete: boolean) => void;
};

export const DaysNumberToAddRoom = ({
  setRange,
  setAutoCompleteDay,
}: Props) => {
  const { selectedDay } = useSelector((state: AppState) => state.quotation);
  const [localValue, setLocalValue] = useState<[number, number]>([
    selectedDay?.number ?? 1,
    selectedDay?.total ?? 1,
  ]);
  const [autoComplete, setAutoComplete] = useState(true);

  useEffect(() => {
    setRange(localValue);
  }, [localValue]);

  useEffect(() => {
    setAutoCompleteDay(autoComplete);
  }, [autoComplete]);

  return (
    <div className="flex justify-center">
      <div className="w-48">
        <Checkbox
          inputId="checkbox1"
          label={{
            text: "Autocompletar días",
            className: "text-sm font-light ml-2",
          }}
          onChange={(e) => {
            setAutoComplete(e.checked ?? false);
          }}
          checked={autoComplete}
        />
        <div className="flex flex-column align-items-center mt-2">
          <div className="flex justify-center items-center gap-2">
            <InputNumber
              value={localValue[0]}
              onChange={(e) => {
                let value = e.value ?? 1;

                if (value > selectedDay!.total) value = selectedDay!.total;
                if (value > localValue[1]) value = localValue[1];
                setLocalValue([value, localValue[1]]);
              }}
              min={1}
              pt={{
                incrementButton: {
                  className: "w-6",
                },
                decrementButton: {
                  className: "w-6",
                },
              }}
              max={selectedDay!.total}
              showButtons
              inputClassName="custom-otp-input-sample p-disabled max-w-30 p-inputtext-sm"
              className="max-w-30"
            />

            <p className="text-4xl font-light">-</p>

            <InputNumber
              value={localValue[1]}
              onValueChange={(e) => {
                setLocalValue([localValue[0], e.value ?? selectedDay!.total]);
              }}
              min={1}
              pt={{
                incrementButton: {
                  className: "w-6",
                },
                decrementButton: {
                  className: "w-6",
                },
              }}
              max={selectedDay!.total}
              showButtons
              inputClassName="custom-otp-input-sample p-disabled max-w-30 p-inputtext-sm"
              className="max-w-30"
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
