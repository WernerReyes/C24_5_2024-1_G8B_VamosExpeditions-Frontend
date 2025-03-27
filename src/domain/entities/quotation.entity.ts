import type {
  ReservationEntity
} from "./reservation.entity";
import type {
  VersionQuotationEntity
} from "./versionQuotation.entity";

export interface QuotationEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  versions: VersionQuotationEntity[];
  reservation?: ReservationEntity;
}
