import {
  DataTableCostSummary,
  HotelListDetailsSummary,
  HotelsDetailsSummary,
} from "./components";

export const CostSummaryModule = () => {
  return (
    <>
      <HotelListDetailsSummary />

      <HotelsDetailsSummary />

      <DataTableCostSummary />
    </>
  );
};
