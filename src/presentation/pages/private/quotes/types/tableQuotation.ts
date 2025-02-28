import type { VersionQuotationEntity } from "@/domain/entities";

export interface TableQuotation extends VersionQuotationEntity {
  versions: VersionQuotationEntity[];
}
