export enum QuoteStatusEnum {
  Pending = "Pendiente",
  Accepted = "Aceptado",
  Rejected = "Rechazado",
}

export type VersionEntity = {
  id: number;
  startDate: Date;
  endDate: Date;
  status: QuoteStatusEnum;
  passengers: number;
  representative: {
    id: number;
    name: string;
  };
  customer: {
    name: string;
    country: string;
  };
  total: number;
};

export type QuoteEntity = {
  id: number;
  startDate: Date;
  endDate: Date;
  status: QuoteStatusEnum;
  passengers: number;
  representative: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
    country: string;
  };
  versions: VersionEntity[];
  total: number;
};
