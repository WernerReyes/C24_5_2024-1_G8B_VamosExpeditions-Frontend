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
  month: string;
  income: number;
  margin: number;
  trips: number;
}
