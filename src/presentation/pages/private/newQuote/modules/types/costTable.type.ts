import type { CostTableEnum } from "../CostSummary/enums/costTable.enum";

export type CostTableType = {
  name: CostTableEnum;
  total:
    | number
    | {
        [key: string]: {
          total: number;
          indirectCost: number;
          directCost: number;
          totalCost: number;
        };
      };
  grandTotal: number;
};
