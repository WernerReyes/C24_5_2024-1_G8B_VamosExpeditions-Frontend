export type ExtraReservationsStatsInfo = {
  total: number;
  totalCurrentMonth: number;
  totalPreviousMonth: number;
  increase: number;
};

export interface GetReservationsStats {
  totalActive: ExtraReservationsStatsInfo;
  totalPendingQuotations: ExtraReservationsStatsInfo;
  totalMargin: ExtraReservationsStatsInfo;
  totalIncome: ExtraReservationsStatsInfo;
}

export interface GetReservationsStadistics {
  pricesPerMonth: {
    month: string;
    income: number;
    margin: number;
    trips: number;
  }[];
  years: number[];
}
