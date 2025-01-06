import { classNamesAdapter } from "@/core/adapters";
import { Button } from "../Button";

type Props = {
  refetch: () => void;
  isFetching: boolean;
  isLoading: boolean;
  message: string;
};

export const DefaultFallBackComponent = ({
  refetch,
  isFetching,
  isLoading,
  message,
}: Props) => {
  return (
    <div className="flex justify-center gap-x-2 items-center text-slate-500">
      <i className="pi pi-exclamation-triangle"></i>

      <h5>{message}</h5>
      <Button
        onClick={(e) => {
          e.preventDefault();
          refetch();
        }}
        text
        icon={classNamesAdapter({
          "pi pi-spin pi-spinner": isFetching,
          "pi pi-refresh": !isFetching,
        })}
        className="p-0 text-slate-500"
        disabled={isLoading}
      />
    </div>
  );
};
