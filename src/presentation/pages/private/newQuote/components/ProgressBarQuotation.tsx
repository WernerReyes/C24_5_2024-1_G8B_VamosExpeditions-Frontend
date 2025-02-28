import { AppState } from "@/app/store";
import { ProgressBar } from "@/presentation/components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const ProgressBarQuotation = () => {
  const { currentStep } = useSelector((state: AppState) => state.quotation);
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const [completed, setCompleted] = useState<number>(0);
   

  useEffect(() => {
    if (!currentVersionQuotation) return;
    setCompleted(currentVersionQuotation.completionPercentage);
  }, [currentStep, currentVersionQuotation]);

  return (
    <ProgressBar
      value={completed}
      className="max-sm:mx-5 max-w-sm md:max-w-md max-sm:text-xs max-sm:h-4 sm:mx-auto"
    />
  );
};
